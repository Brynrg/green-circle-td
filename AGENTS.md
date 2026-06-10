# Agent guide — Green Circle TD

Read this before changing anything. It explains the architecture, the deploy
pipeline, and the traps that have already bitten previous sessions.

## ⚠ The three rules that matter most

1. **The simulation is DUPLICATED in two repos.** `main.js` here runs the solo /
   local hot-seat game. `Brynrg/gctd-server` (`sim.js`) is a headless 1:1 port of
   the same mechanics for online multiplayer. **Any balance change — tower stats,
   enemy stats, armor matrix, waves, economy, upgrade costs — must be applied in
   BOTH repos**, then the server redeployed (`fly deploy` in gctd-server).
2. **Always run `node build.mjs` after editing source.** The portal ingest reads
   ONLY `dist/`, never the repo root. v1.7.0 shipped stale files because this
   step was skipped. No build = your changes silently don't deploy.
3. **`net.js` must load AFTER `main.js`** (see `index.html`). They are classic
   scripts sharing top-level scope: `net.js` uses `main.js`'s consts
   (`TOWERS`, `ENEMIES`, `SPECS`, `statsFor`, `CELL`, `PLAYER_COLORS`, `fmt`,
   `WAVES`) and must not redeclare any top-level name from `main.js`.

## Architecture

| File | Role |
|---|---|
| `main.js` | Whole game: data tables, sim, renderer, input, UI. Solo + local co-op run the sim locally. |
| `net.js` | Online multiplayer client: lobby UI (create/join by 4-letter code) + `NetSession`, which mirrors authoritative server state into the `Game` object so the existing renderer draws it. |
| `index.html` / `style.css` | Static shell. Lobby styles are the `.n*` classes at the bottom of `style.css`. |
| `build.mjs` | Stages source → `dist/` for portal ingest (excludes repo metadata, `.md`, `.claude/`). |
| `game.manifest.json` | Portal metadata. **Bump `version` on every deploy.** |

### Online mode (v1.8.0+)

- Server: **`Brynrg/gctd-server`**, deployed as Fly.io app `gctd-server`
  (`wss://gctd-server.fly.dev`, region sjc, auto-stop/auto-start). The server is
  authoritative: it runs the one true sim at 30Hz and broadcasts compact
  snapshots at 15Hz; clients send only inputs.
- Client override for local dev: `?server=ws://localhost:8080` or
  `localStorage["gctd:server"]`.
- `Game` methods branch on `this.net` (set by `NetSession` when a game starts):
  `build` / `upgradeTower` / `sellAt` / `startNextWave` / speed buttons send
  protocol messages instead of mutating; `update()` only eases enemy positions
  toward snapshot targets and decays fx; `togglePause` / `cyclePlayer` /
  `restart` are disabled or repurposed.
- Network enemies are mirror objects with **no `path`**; they carry `netAng`
  (heading) and `netProg` (path progress) instead. `drawCreep` and
  `pickTargets` have guards for this — keep them if you refactor.
- Per-player build zones (`cellOwner`), per-player gold, **shared lives** —
  faithful to the WC3 original. Zone/gold/upgrade rules are validated
  server-side; the client checks are UX only.

### Protocol cheat-sheet (client ⇄ server, JSON over WebSocket)

- → `{t:"create"|"join", name, code?}` · `{t:"start"}` (host) ·
  `{t:"build", c, r, tower}` · `{t:"upgrade", c, r, choice}` ·
  `{t:"sell", c, r}` · `{t:"wave"}` · `{t:"speed", v}` (host)
- ← `{t:"joined"|"players"|"started"|"err"...}` · `{t:"towers", tw, g}` ·
  `{t:"wave"|"cleared"|"over"|"speed"...}` · snapshot
  `{t:"s", ms, lv, g, wi, aw, e:[[id,kind,x,y,hpFrac,prog,ang,statusBits]...], sh, dx}`

The authoritative protocol definition lives in `gctd-server/server.js` + `sim.js`.

## Deploy pipeline (game → speedrungames.net)

```bash
# 1. edit source, then ALWAYS:
node build.mjs
# 2. bump "version" in game.manifest.json
# 3. commit + push this repo
# 4. in the hub repo (Brynrg/speedrungames, working copy often /tmp/srg-hub):
git checkout main && git fetch && git reset --hard origin/main
node scripts/ingest-game-build.mjs --game-dir <this repo> --status live
git checkout -b deploy-gctd-vXYZ && git add -A && git commit && git push origin deploy-gctd-vXYZ
gh pr create ... && gh pr merge --squash --admin
```

Netlify auto-deploys the hub's `main`. Server-side changes deploy separately:
`fly deploy` inside the gctd-server repo.

## Testing

- Client is dependency-free; syntax check with `node --check main.js net.js`.
- Server tests live in gctd-server: `npm test` (headless sim test + end-to-end
  ws protocol test) and `node test/prod-smoke.js` (against production).
- Local 2-player loop: `PORT=8124 node server.js` in gctd-server, serve `dist/`
  here (`python3 -m http.server 4173 --directory dist`), open
  `http://localhost:4173/?server=ws%3A%2F%2Flocalhost%3A8124`, and use
  `gctd-server/test/join-bot.js <CODE>` as a second player.

## Known gotchas

- Wave order is shuffled per run (`shuffleWaveOrder`) within difficulty bands;
  bosses fixed at 10/20/30. Don't assert "wave 1 is First Light" in tests.
- Enemy `count_bonus` modifies spawn counts (e.g. "Iron Probe" 8 → 7 Armored).
- Snipers/Rapid/Frost are the only anti-air towers (`canAir`); chaos (`void`)
  ignores the armor matrix by having all-1.0 multipliers.
- `requestAnimationFrame` pauses in hidden tabs: in online mode, mirrored enemy
  positions freeze visually while snapshots keep arriving (tx/ty advance). Not
  a bug.
- `.claude/launch.json` (preview config) must never ship — `build.mjs` excludes
  `.claude/`; keep it that way.
