// Generates docs/tree.txt: a compact repo structure for LLM context.
// Usage (from anywhere inside the repo): node scripts/tree.mjs
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const MAX_DEPTH = 4; // directories deeper than this collapse into "name/ (N files)"
const SKIP = [
  /package-lock\.json$/,
  /\.(png|jpe?g|gif|svg|ico|woff2?|ttf)$/i,
  /^docs\/(archive\/|tree\.txt$)/,
];

const root = execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
process.chdir(root);

// Tracked + untracked-but-not-ignored files; .gitignore already removes node_modules, dist, etc.
const files = execSync("git ls-files --cached --others --exclude-standard", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((f) => existsSync(f))
  .filter((f) => !SKIP.some((r) => r.test(f)));

const tree = {};
for (const f of files) {
  f.split("/").reduce((n, p, i, a) => (n[p] ??= i === a.length - 1 ? null : {}), tree);
}

const count = (n) => Object.values(n).reduce((s, c) => s + (c ? count(c) : 1), 0);
const out = [];
const walk = (n, d) => {
  const entries = Object.entries(n).sort(([a, x], [b, y]) => !!y - !!x || a.localeCompare(b));
  for (const [name, c] of entries) {
    const pad = "  ".repeat(d);
    if (!c) out.push(pad + name);
    else if (d + 1 >= MAX_DEPTH) out.push(`${pad}${name}/ (${count(c)} files)`);
    else {
      out.push(`${pad}${name}/`);
      walk(c, d + 1);
    }
  }
};
walk(tree, 0);

mkdirSync("docs", { recursive: true });
writeFileSync("docs/tree.txt", out.join("\n") + "\n");
console.log(`docs/tree.txt updated (${out.length} lines)`);
