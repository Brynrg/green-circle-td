# Product

## Register

product

## Users

Speedrunners and casual tower defense players in a browser, desktop-first with mobile support. Primary context: a focused session — picking towers, watching creeps, watching the timer. The game IS the task; the UI is purely instrumental.

## Product Purpose

A browser port of the classic WC3 Green Circle TD: creeps spiral from four corners toward the center, players build and upgrade towers in the gaps to stop them. The speedrun timer is the score. Success means surviving all 30 waves and beating your personal best. Online co-op (2–4 players, WC3-style room codes, per-player zones, shared lives) recreates the original's multiplayer; the lobby surfaces (name entry, room code, waiting room) carry the same tactical-HUD register as the rest of the shell — a room code is mission intel, not a party invitation.

## Brand Personality

Tactical. Urgent. Readable — with a Martian / Gold Society register (Iron Rain):
iron + Peerless brass chrome, scarlet danger, gold timer. The UI should feel
like military HUD hardware over a Red Rising–inspired arena: information-dense,
glanceable, with no decoration that doesn't carry data. The canvas game world is
dark, dusty, and alive; the HTML shell frames it without competing.

## Anti-references

- Indie game pastel-and-rounded-corners web aesthetic (itch.io "cozy" style)
- Neon cyberpunk glow-everything treatment
- Casual mobile game UI: bubbly buttons, soft drop shadows everywhere
- Fantasy RPG parchment / scroll aesthetic
- Cold War green PPI-radar phosphor (superseded by Iron Rain gold/ember)

## Design Principles

1. **The timer owns the room** — the speedrun clock is the emotional center of every session. It commands visual hierarchy; everything else is supporting cast.
2. **Information, not decoration** — every element earns its place by giving the player actionable data at a glance.
3. **State over style** — active / danger / disabled states matter more than idle aesthetics. Design the transitions.
4. **Game feel in the shell** — wave launches, boss warnings, wave clears are events. The HTML UI should have presence at those moments, not just sit there.

## Accessibility & Inclusion

WCAG AA baseline. Reduced-motion alternatives for all animations. Focus-visible rings on all interactive elements. High-contrast readable text at all game states.
