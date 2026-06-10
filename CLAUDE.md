# Green Circle TD — Claude notes

**Read `AGENTS.md` first** — it is the canonical agent guide (architecture,
deploy pipeline, protocol, gotchas).

Non-negotiables, duplicated here in case you skip it:

1. **Balance changes must land in TWO repos**: this one (`main.js`) AND
   `Brynrg/gctd-server` (`sim.js`, a headless port of the same sim used for
   online multiplayer). Then `fly deploy` the server.
2. **Run `node build.mjs` after every source edit** — the portal ingest reads
   only `dist/`. Skipping this once already shipped a stale build (v1.7.0).
3. **Bump `version` in `game.manifest.json`** on every deploy.
4. `net.js` loads after `main.js` and shares its top-level scope — don't
   redeclare its consts, don't reorder the script tags.
