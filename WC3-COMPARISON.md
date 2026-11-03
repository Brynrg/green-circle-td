# Green Circle TD — where this port stands against the WC3 original

Written 2026-11-02 for the v2.4.0 pass. This is a comparison of *mechanics*, not
of nostalgia: it records what the Warcraft III map does, what this port does,
and where the gap still is.

## A caveat about "the original"

There is no single Green Circle TD. The surviving WC3 lineage includes at least
**Classic**, **v3.x**, **v9.9**, **Gold v1.8**, **Angle 2.00**, **Around SS 3.0a**
and **Eternal 2024**, and they disagree on fundamentals:

| | v9.9 "stable classic" | Classic / Eternal 2024 | Gold v1.8 |
|---|---|---|---|
| Loss condition | lives, −1 per leak | unit cap (>700, or <1000 alive) | leaks removed entirely |
| Waves | 36 | 36 / 60+ in Pro | — |
| Sell refund | — | 50% | 100% |

This port follows the **v9.9 lives model** (leak = lose a life), which is the
variant its own design is built around. Claims below about "the original" mean
that lineage unless stated.

## Faithful to the original

| Mechanic | Original | This port |
|---|---|---|
| Four corner spawns, creeps circle inward to the centre | ✔ | ✔ `loopPath()` — a full lap per ring, then an L-notch inward |
| Every creep passes every player's zone | ✔ | ✔ all four streams share the same rings |
| Leak = lose a life | ✔ (−1) | ✔ −1, and −4 hero / −10 boss |
| Per-player build zones, shared lives | ✔ | ✔ `cellOwner()`, authoritative server validates |
| Armour vs damage type matters | ✔ | ✔ 5×5 matrix, incl. WC3 chaos (ignores armour) |
| Air waves need dedicated anti-air | ✔ | ✔ only Sniper / Rapid / Frost (+ their specs) |
| Team up in the late game | ✔ | ✔ 2–4p online with room codes, plus local hot-seat |
| Sell for a partial refund | ✔ (50–100%, version-dependent) | ✔ 70% |

## Where this port is ahead

- **Next-wave scouting report.** Composition, armour class, per-creep HP, flag
  badges and bounty pool for the wave you have *not* sent. The WC3 map teaches
  you each wave by making you leak it once.
- **Live armour read-out.** A selected tower shows what its damage type is
  actually worth against the creeps currently on the board (`Vs field ×0.35`–`×2`),
  the effective damage it has dealt, and its sell value. In WC3 the matrix is
  off-screen knowledge.
- **Speedrun framing.** Millisecond timer, personal best, fixed-path mode that
  removes fork variance, 1×/2×/3× speed, and `+15g` for stacking a wave early.
- **Three-way specialisations** on all eleven towers at Lv3, on top of Lv1→3.
- **Randomised wave order** within difficulty bands, so the run is not a
  memorised script. Bosses stay fixed at 10 / 20 / 30.
- **Multi-phase bosses** that accelerate at 60% and 25% HP and call in adds.
- **Economy depth**: kill bounty to the killing tower's owner, wave-clear reward
  split in co-op, Mint income towers, 2% capped interest, income benchmarks.
- **No Warcraft III required** — runs in a browser, on a phone too.
- **Authoritative server** for online play, so the host cannot desync the sim.

## Where the original is still ahead

These are real gaps, not oversights to wave away:

- **Wave count.** 30 here vs 36 (v9.9) or 60+ (Pro). There is no endless mode
  after wave 30.
- **Player count.** 4 here vs 8 in several WC3 versions, which changes the
  late-game "team up with your allies" dynamic the map is known for.
- **Difficulty modes.** 3 (Normal / Hard / Intense, pure stat multipliers) vs
  Eternal 2024's 4 modes that change *composition* and regeneration, not just
  numbers.
- **No unit-cap pressure valve.** Some WC3 versions let creeps pile up and lose
  you the game on count; here a creep that survives the lap just takes a life.
- **Tower roster size.** 11 families × 3 specs here. The WC3 lineage and the
  DasPeTe browser remake both carry far larger rosters.

## Fixed in v2.4.0

- **Splash damage ignored targeting rules.** Any splash tower (Splash, Cannon,
  Mortar, Glacier, Plague, Rift, Pulse…) damaged flying creeps it had no right to
  hit, and killed un-revealed invisible creeps with no Detector on the board.
  That silently voided two of the map's defining constraints. Both the client
  sim and the authoritative server sim now route every damage check through one
  `canHit(tower, enemy)` predicate.
- **Silent build/upgrade refusals.** A click that failed for gold, zone, lane or
  occupancy did nothing at all. It now says why, at the cursor, with a sound.
- **README claimed a 2-way specialisation.** The code has had three branches per
  tower since v2.2.0.

## Sources

- [Green Circle TD Gold v1.8 — Hive Workshop](https://www.hiveworkshop.com/threads/green-circle-td-gold-v1-8.127213/)
- [Green Circle TD Around SS 3.0a — Hive Workshop](https://www.hiveworkshop.com/threads/green-circle-td-around-ss-3-0a.350930/)
- [Green Circle TD V 3.1 — wc3maps.com](https://wc3maps.com/map/28453)
- [Green Circle TD Eternal 2024 1.5 — wc3maps.com](https://wc3maps.com/map/355862)
- [Green Circle TD Classic — wc3maps.com](https://wc3maps.com/map/207129)
- [Green TD — gaming-tools.com](https://gaming-tools.com/warcraft-3/green-td/)
