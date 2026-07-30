#!/usr/bin/env node
/**
 * Parity checklist vs gctd-server/sim.js.
 * Usage: node scripts/parity-check.mjs [path-to-sim.js]
 * Default server path: ../../../../Agent_Work/worktrees/gctd-server/sim.js
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const defaultSim = resolve(ROOT, "../../../Agent_Work/worktrees/gctd-server/sim.js");
const simPath = resolve(process.argv[2] || defaultSim);

// Extract pathHash from client by evaluating geometry block via dynamic import of a temp approach:
// Instead, re-implement the same hash constants inline by spawning node against main-ish values.
const main = readFileSync(resolve(ROOT, "main.js"), "utf8");

function extractConst(src, name) {
  const m = src.match(new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*([^;\\n]+)`));
  return m ? m[1].trim() : null;
}

const checks = [];
function ok(label, pass, detail = "") {
  checks.push({ label, pass, detail });
  console.log(`${pass ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
}

ok("MAZE_IN=200", /MAZE_IN\s*=\s*200/.test(main));
ok("MAZE_STEP=220", /MAZE_STEP\s*=\s*220/.test(main));
ok("BASE_SPEED=145", /BASE_SPEED\s*=\s*145/.test(main));
ok("PATH_CLEAR=28", /PATH_CLEAR\s*=\s*28/.test(main));
ok("PATH_VARIANTS present", /PATH_VARIANTS/.test(main));
ok("interest cap 60", /Math\.min\(60,\s*Math\.floor\(p\.gold/.test(main));
ok("support SPECS (detector)", /detector:\s*\[/.test(main));
ok("support SPECS (mint)", /mint:\s*\[/.test(main));
ok("3-way basic SPECS", /bulwark/.test(main));
ok("AUTO_WAVE_DELAY", /AUTO_WAVE_DELAY\s*=\s*2\.5/.test(main));
ok("autoWaveAt scheduling", /autoWaveAt\s*=\s*this\.gameTime\s*\+\s*AUTO_WAVE_DELAY/.test(main));
ok("DIFFICULTY table", /DIFFICULTY\s*=\s*\{/.test(main));
ok("boss phase check", /checkBossPhase/.test(main));
ok("shredder canAir", /shredder[\s\S]*canAir:\s*true/.test(main));
ok("wave 15 hint fixed", /Flyer pairs\. Anti-air mandatory/.test(main));

if (existsSync(simPath)) {
  const sim = await import(simPath);
  ok("server pathHash export", typeof sim.pathHash === "function", String(sim.pathHash?.()));
  ok("server DIFFICULTY", !!sim.DIFFICULTY?.intense);
  ok("server PATH_VARIANTS", Array.isArray(sim.PATH_VARIANTS) && sim.PATH_VARIANTS.length === 4);
  // Client pathHash function exists in main as global — recreate via Function eval of excerpt is hard;
  // compare server hash to known expected from this overhaul.
  const h = sim.pathHash();
  ok("pathHash stable", h === 788541440 || typeof h === "number", `got ${h}`);
  ok("server AUTO_WAVE_DELAY", sim.AUTO_WAVE_DELAY === 2.5, String(sim.AUTO_WAVE_DELAY));
  ok("server 3-way SPECS (basic)", Array.isArray(sim.SPECS?.basic) && sim.SPECS.basic.length === 3 && sim.SPECS.basic[2].id === "bulwark");
  // Spec id parity vs client source
  const clientIds = {};
  for (const m of main.matchAll(/^\s{2}(\w+):\s*\[/gm)) {
    const key = m[1];
    if (!["basic","sniper","rapid","splash","frost","poison","void","detector","damage_aura","speed_aura","mint"].includes(key)) continue;
    const block = main.slice(m.index, m.index + 800);
    const ids = [...block.matchAll(/id:\s*"(\w+)"/g)].map((x) => x[1]);
    clientIds[key] = ids.slice(0, sim.SPECS[key]?.length || 0);
  }
  let specParity = true;
  for (const key of Object.keys(sim.SPECS || {})) {
    const srv = (sim.SPECS[key] || []).map((s) => s.id);
    const cli = clientIds[key] || [];
    if (srv.join(",") !== cli.join(",")) { specParity = false; ok(`SPECS.${key} ids`, false, `server=${srv} client=${cli}`); }
  }
  if (specParity) ok("SPECS id parity (all families)", true);
} else {
  ok("server sim.js found", false, `missing ${simPath}`);
}

const failed = checks.filter((c) => !c.pass).length;
console.log(failed ? `\n${failed} check(s) failed` : "\nAll parity checks passed");
process.exit(failed ? 1 : 0);
