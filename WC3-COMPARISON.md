# Green Circle TD — measured against the actual WC3 map

Rewritten 2026-11-02 from **decompiled map files**, replacing an earlier version of
this document that was written from web sources. Several of that version's claims
were wrong; they are corrected and called out below.

## Method

`Green Circle TD.w3x` and six other forks were read out of their MPQ archives
(`war3map.j` JASS, `war3map.w3u` unit table, `war3mapMisc.txt`, `war3map.wts`).
Eight mechanic dimensions were analysed in parallel and every claim was then
re-derived from the raw files by an independent adversarial pass; 52 of 233
findings did not survive it. Numbers here are the survivors, plus claims verified
by hand afterwards.

The base map is the 2010 build (`"GOD TEAM"`, script dated Mon Jul 05 2010),
8 players. The six forks checked alongside it: `v9.9 Hard`, `v9.9.2 2025`,
`2025d`, `Pro v1.0a`, `Mega 13.5.6`, `Hell 1.1`.

## What the original actually does

### There are no lives. The loss condition is a recoverable shared meter.

`udg_CurrentlyOnMap >= udg_LoseValue` where `LoseValue = 900.00`, polled every
0.44 s. Each creep that leaks onto the shared ring adds `225.00 / NumberToSpawn[its level]`
— **and killing it later subtracts that weight again**. Leaked creeps keep circling
and keep counting until somebody kills them. The meter is one global shared by all
8 players (the leaderboard shows it as a "% Overrun" row), so it is one shared fate
with no per-player life pool and no per-player defeat.

This is the single biggest divergence from our port, and it is a **better**
design than lives in one specific way: a leak is a debt you can pay off, not a
permanent loss. The pressure is "how much is standing on the ring right now".

> **Correction.** The previous version of this document stated the port "follows
> the v9.9 lives model (leak = lose a life)" and listed lives as faithful to the
> original. That is wrong for this map — it has no lives counter at all.

### There is no centre, and no spiral.

The map is **two concentric square lanes**, not one inward spiral. Four players
own corners of an outer ring (centreline |x| or |y| = 3840), four own mid-side
nodes of an inner ring (radius 2816). Creeps enter at their owner's node and then
**random-walk the rings forever** — at each mid-edge node, and at the four outer
corners, they roll `GetRandomInt(1,100) > 50` to cross between rings through a
640-long connector on the axes. There is no goal tile, no exit, and nothing
happens at the map centre.

> **Correction.** The previous version listed "creeps circle inward to the centre"
> as faithful parity. The original has no centre objective; our inward spiral to a
> green circle is our own invention.

### The damage table is custom, and Chaos is the opposite of what we built.

From `war3mapMisc.txt`, verified byte-for-byte:

| attack ↓ / armour → | Light | Medium | Heavy | Fortified | Normal | Hero | **Divine** | Unarmored |
|---|---|---|---|---|---|---|---|---|
| Normal | 1.00 | 1.10 | 1.00 | 0.90 | 1.00 | 1.00 | **0.05** | 1.00 |
| Pierce | 1.20 | 0.95 | 1.00 | 0.85 | 1.00 | 0.80 | **0.05** | 1.25 |
| Magic  | 1.10 | 0.85 | 1.30 | 0.75 | 1.00 | 0.85 | **0.05** | 1.00 |
| Siege  | 1.00 | 0.90 | 1.00 | 1.10 | 1.00 | 0.90 | **0.05** | 1.10 |
| Hero   | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | **0.05** | 1.00 |
| **Chaos** | 0.02 | 0.02 | 0.02 | 0.02 | 0.02 | 0.02 | **1.00** | 0.02 |

Two things follow, and both contradict our design:

1. **Ordinary armour matching barely matters** — every non-Chaos cell sits in
   0.75–1.30. Our matrix swings 0.35–2.00, roughly four times as punishing. In the
   original, picking the "wrong" tower costs you ~25%; in ours it can cost 65%.
2. **Chaos is a dedicated anti-Divine key, not a generically strong tower.** It
   does 0.02× to everything except Divine. Waves 5, 10, 15, 20, 25 and 30 are
   Divine (plus `Amim` magic immunity), take 0.05× from everything else, and are
   effectively unkillable without a Chaos line. So the real game is: build general
   DPS for 30 waves, and maintain a *separate* Chaos line that is dead weight on
   every wave except six known ones.

> **Correction.** The previous version claimed our chaos damage type (all-1.0,
> "ignores armour") matched "WC3 chaos". It does not. Ours is a universally good
> late tower; theirs is a situational hard counter that is 50× worse than useless
> the rest of the time.

### Tower upgrades have strongly *increasing* returns

Six buildable families, each a single linear chain: **Siege 22 tiers, Poison 16,
Chaos 10, Air 10, Frost 6, Aura 3**. Damage follows a tier-N → `N d N` dice pattern
while cooldown falls monotonically, so efficiency climbs the whole way:

| Siege tier | cost | DPS | **DPS per 100g** |
|---|---|---|---|
| 1 | 51 | 3.3 | **6.5** |
| 11 | 1,270 | 2,345 | **185** |
| 22 | 7,307 | 103,073 | **1,411** |

A 217× efficiency gain bottom to top (Poison runs 55 → 5,568). **There is no
diminishing-returns point — late tiers are strictly the better buy.** That one
fact explains the rest of the design: why *downgrade* exists (recover gold from a
line you over-committed to), why the community advice is "team up with your allies
late", and why a 22-step ladder is playable at all.

Our Lv1→3 curve is 1.0/1.7/2.6× damage at 0.8×/1.3× base cost — roughly linear,
tending to diminishing. **The original rewards concentrating gold into one tall
tower; ours rewards spreading it.**

### Everything else, briefly

- **36 waves**, one creep type per wave, auto-sent every ~55 s. No send-early, no
  stacking, no "-go" command. HP is hand-authored per creep with no formula, so the
  curve is deliberately non-monotonic (Divine waves are HP troughs because 0.05×
  already does the work).
- **Waves 1–27 cannot attack** (`attacksEnabled=0`); waves 28–36 can.
- **Air waves 7, 17, 23, 27, 35** — identical in all seven map files examined, so
  this is load-bearing canon. Implemented as `umvt=hover`. Only Poison, Air and
  Frost reach them; Siege and Chaos are ground-only.
- **Economy**: 172 gold once at init, then nothing but native WC3 kill bounty. No
  interest, no wave reward, no leak penalty, no lumber. Sell refunds **100%** of the
  unit's hand-authored Point Value; downgrade refunds the point-value difference.
  Because point values are hand-maintained, several lines refund more than they
  cost — the Aura chain costs 14,550 and sells for 18,600, a repeatable
  infinite-gold loop. Poison tiers 11–16 cannot be downgraded at all (loop bound).
- **Difficulty vote**: a 20 s dialog, plurality, ties break easier, non-voters count
  as Normal. It changes exactly two things — a creep-player handicap (90/100/110%)
  and a hidden map-centre aura unit (creep speed −40%/−20%/0%, armour +0/+50/+100%).
  Wave composition, counts and the 900 threshold are difficulty-independent.
- **Newer forks** publish the whole armour schedule as chat commands (`-air`,
  `-divine`, `-heavy`…). 2025d: Medium 1,19 · Normal 2,14,21 · Unarmored 3,16,24 ·
  Fortified 4,8,9,11,12,18,26,29 · Divine 5,10,15,20,25,30,35,36 · Hero 6,27,28,32,33,34 ·
  Heavy 7,13,17,22,31 · Light 17,23 · Boss 31,33,36. Mega 13.5.6 adds invisible
  levels 12,19,23,24,32 revealed by a Ward Tower.
- **QoL** is thin: six chat commands, an **unsorted** leaderboard showing kills,
  and host-dictator kick (only Red, no vote). The in-game help for `-kick` is itself
  broken — the author wrote `{color}` and the `}` terminated the WTS string block,
  so the most important command is truncated mid-word everywhere it is documented.

### Bugs in the shipped map

- **Waves 18 and 19 are swapped** relative to the creeps' own `level` fields. Since
  the overrun weight is looked up by `GetUnitLevel`, wave 18's ghouls are billed
  11.25 each instead of 1.125 — a 10× overrun penalty on a wave the UI says has 200
  creeps.
- **Only ~79–87% of each wave actually spawns.** `SpawningRate = 450/N` at one tick
  per 0.15 s needs 67.5 s to emit N, but `WaveTimeManager` waits 55 s and moves on.
- **Victory is cosmetic** — reaching level 37 prints "You win, nice going!" but never
  calls `CustomVictoryBJ` or disables the loss trigger, so you can still lose after
  winning.

## Where our port genuinely leads

- Next-wave scouting report and live armour effectiveness read-out.
- Speedrun framing: millisecond timer, PB, fixed-path mode, 1×/2×/3×, send-early
  with a gold bonus.
- Three-way specialisations and multi-phase bosses.
- Authoritative server; no Warcraft III install required; runs on a phone.
- Our win condition actually ends the game.

## Closed in v3.0.0

Four of the gaps below were closed by porting the mechanics this document
describes: the recoverable overrun meter replaces lives, the armour matrix is
flattened to the original's real 0.75–1.30 band with Divine walls where Chaos
is by far the efficient answer (skipping it is costly, not impossible), tower downgrade is in, and the wave schedule is fixed and
published. What remains is listed next.

## Where the original still leads

- **36 waves vs our 30**; 8 players vs our 4.
- **A tower ladder with increasing returns**, which makes the gold decision
  interesting for the whole game rather than only until everything is Lv3.
- **8 armour classes**; we now have 6 (Divine added in v3), still no Unarmored —
  though under a flattened matrix it would differ from Light by 0.05, below the
  point where it changes a decision.

## Reproducing the extraction

MPQ reading needed two fixes over stock `mpyq`: encrypted-block support (it raises
`NotImplementedError`), and a bug where its `_decrypt` returns only whole dwords and
silently drops a 1–3 byte tail, truncating the compressed stream. The map files
themselves are not vendored into this repo.
