# Green Circle TD

A standalone web tower-defense for [speedrungames.net](https://speedrungames.net).
Web port of the original Python/Arcade game — the tower, enemy, armor-matrix, and
wave **content is ported verbatim from the original game's data files** — extended
with WC3-parity features and true online multiplayer.

Play: creeps spiral in from all four corners to the center (the "green circle").
Build towers in the gaps between the spiral arms, match damage types to enemy
armor, and survive all 30 escalating waves up to a multi-phase boss — as fast as
you can (speedrun).

> 🤖 **AI agents: read [`AGENTS.md`](AGENTS.md) before changing anything.**
> Key traps: the sim is duplicated in `Brynrg/gctd-server`, and the deploy
> pipeline only ships `dist/` (always run `node build.mjs`).

## Signature systems

- **🌐 Online multiplayer (2–4 players)** — WC3-style lobby: create a room,
  share the 4-letter code, host starts. Each player builds in their own zone
  with their own gold; **lives are shared**. Authoritative server
  ([Brynrg/gctd-server](https://github.com/Brynrg/gctd-server) on Fly.io at
  `wss://gctd-server.fly.dev`) runs the one true sim; clients send inputs and
  render 15Hz snapshots. Local 1–4 player hot-seat co-op also available (Tab
  switches the active builder).
- **Four-corner spiral paths** — creeps spawn from each corner and follow
  concentric loops inward to the center (ported from the original
  `core/path.py`). A leak = a creep reaching the center (boss −10 lives,
  hero −4, others −1).
- **Armor-vs-damage matrix** — `pierce / siege / magic / normal / chaos` vs
  `light / medium / heavy / fortified / hero`. Chaos (WC3-style) ignores armor
  entirely — the late-game answer to immune+fortified stacks.
- **11 towers** — Basic, Sniper, Rapid, Splash (AoE), Frost (slow), Poison
  (DoT), Detector (reveals invisibles), Damage Aura (+20% nearby), Speed Aura
  (−15% cooldown nearby), Mint (+gold per wave cleared), Void (chaos damage).
  Lv1→3 upgrades, then a 2-way specialization on attackers.
- **Air-targeting restriction** — only Sniper, Rapid, and Frost can hit air
  (✈). Flying waves force dedicated anti-air, like the WC3 original.
- **9 enemy types** with flags — air, immune (to slow/poison), invisible (needs
  a Detector in range to be targeted), hero, boss — each with a distinct
  procedural silhouette for at-a-glance reads.
- **30 waves with randomized order** — non-boss waves shuffle within difficulty
  bands each run (1–9, 11–19, 21–29); bosses fixed at 10 / 20 / 30.
- **Economy** — kill bounties (to the killing tower's owner), wave-clear
  rewards (split in co-op), Mint income, 2% interest (capped), +15g
  stack-a-wave-early bonus.

## Camera & controls

The world is larger than the viewport; the top bar + tower sidebar stay fixed
while you scroll the field.

- **Click** a tile to build · `1`–`9`, `0`, `v` pick a tower · click a tower to
  inspect/upgrade.
- **Drag** to pan · **mouse wheel / pinch** to zoom · `WASD` / arrow keys to scroll.
- **Right-click / long-press** sell (70% refund) · `Space` send the next wave ·
  `P` pause (offline only) · `Esc` deselect · `Tab` next player (local co-op).
- **1× / 2× / 3×** game speed (host-controlled when online).

## Run locally

```bash
node build.mjs
python3 -m http.server 8000 --directory dist   # open http://localhost:8000
```

To test online mode against a local server, run `gctd-server` on port 8080 and
open `http://localhost:8000/?server=ws%3A%2F%2Flocalhost%3A8080`.

## Build & deploy

`node build.mjs` (or `npm run build`) stages the static files into `dist/` for
portal ingest — **the ingest reads only `dist/`**, so this step is mandatory
after any edit. Bump `version` in `game.manifest.json`, push, then run the hub's
`scripts/ingest-game-build.mjs` and merge the deploy PR (full steps in
`AGENTS.md`). The multiplayer server deploys separately (`fly deploy` in
gctd-server).

## Notes

The armor matrix, tower roster, enemy roster, all 30 waves, and the four-corner
spiral geometry are ported from the original `tower-defense/` Python source.
The headless sim in `gctd-server` duplicates these tables — **balance changes
must land in both repos**. Future work: the hero unit and the between-wave card
draft.
