# Green Circle TD

A standalone web tower-defense for [speedrungames.net](https://speedrungames.net).
Web port of the original Python/Arcade game — the tower, enemy, armor-matrix, and
wave **content is ported verbatim from the original game's data files**.

Play: creeps spiral in from all four corners to the center (the "green circle").
Build towers in the gaps between the spiral arms, match damage types to enemy
armor, and survive all 30 escalating waves up to a multi-phase boss — as fast as
you can (speedrun).

## Signature systems

- **Four-corner spiral paths** — creeps spawn from each corner and follow
  logarithmic spirals inward to the center (ported from the original
  `core/path.py`). A leak = a creep reaching the center.
- **Armor-vs-damage matrix** — `pierce / siege / magic / normal` vs
  `light / medium / heavy / fortified / hero`. Pick the right tower for each wave.
- **9 towers** — Basic, Sniper, Rapid, Splash (AoE), Frost (slow), Poison (DoT),
  Detector (reveals invisibles), Damage Aura (+20% nearby), Speed Aura (−15% cooldown nearby).
- **9 enemy types** with flags — air, immune (to slow/poison), invisible (needs a
  Detector in range to be targeted), hero, boss.
- **30 waves**, including boss waves at 10 / 20 / 30.

## Camera & controls

The world is larger than the viewport; the top bar + tower sidebar stay fixed
while you scroll the field.

- **Click** a tile to build · `1`–`9` pick a tower.
- **Drag** to pan · **mouse wheel** to zoom · `WASD` / arrow keys to scroll.
- **Right-click** sell the hovered tower (70% refund) · `Space` start the next
  wave · `Esc` deselect.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Build

`npm run build` stages the static files into `dist/` for portal ingest (relative
asset paths so it resolves under `/games/green-circle-td/`).

## Notes

The armor matrix, tower roster, enemy roster, all 30 waves, and the four-corner
spiral geometry are ported from the original `tower-defense/` Python source.
Future work: the hero unit and the between-wave card draft.
