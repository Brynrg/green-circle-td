# Green Circle TD

A standalone web tower-defense for [speedrungames.net](https://speedrungames.net).
Web port of the original Python/Arcade game — the tower, enemy, armor-matrix, and
wave **content is ported verbatim from the original game's data files**.

Play: place towers along the path, match damage types to enemy armor, and survive
all 30 escalating waves up to a multi-phase boss — as fast as you can (speedrun).

## Signature systems

- **Armor-vs-damage matrix** — `pierce / siege / magic / normal` vs
  `light / medium / heavy / fortified / hero`. Pick the right tower for each wave.
- **9 towers** — Basic, Sniper, Rapid, Splash (AoE), Frost (slow), Poison (DoT),
  Detector (reveals invisibles), Damage Aura (+20% nearby), Speed Aura (−15% cooldown nearby).
- **9 enemy types** with flags — air, immune (to slow/poison), invisible (needs a
  Detector in range to be targeted), hero, boss.
- **30 waves**, including boss waves at 10 / 20 / 30.

## Controls

- `1`–`9` pick a tower, then click a buildable tile (off the path).
- `Space` start the next wave · `S` sell the hovered tower (70% refund) · `Esc` deselect.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Build

`npm run build` stages the static files into `dist/` for portal ingest (relative
asset paths so it resolves under `/games/green-circle-td/`).

## Notes

v1 maps the original game's 4-corner spawns onto a single winding path; the armor
matrix, tower roster, enemy roster, and all 30 waves are preserved. Future work:
multi-corner paths, the hero unit, and the between-wave card draft (see the
original `tower-defense/` Python source in the portal repo).
