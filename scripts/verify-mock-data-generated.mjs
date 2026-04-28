/**
 * Fails if packages/mock-data/src/generated/prototype-fixtures.ts is out of sync
 * with docs/ux-reference/EiraNova-Prototype-v17-REFERENCE.jsx + extract script.
 * Run from repo root: pnpm verify:mock-data-generated
 */
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

execSync("node scripts/extract-prototype-mock-data.mjs", {
  stdio: "inherit",
});

try {
  execSync("git diff --exit-code -- packages/mock-data/src/generated/prototype-fixtures.ts", {
    stdio: "pipe",
  });
} catch {
  console.error(
    "\n❌ prototype-fixtures.ts is out of sync with the UX reference prototype.\n" +
      "   Regenerate: pnpm --filter @eiranova/mock-data generate\n" +
      "   Do not edit packages/mock-data/src/generated/prototype-fixtures.ts by hand.\n",
  );
  process.exit(1);
}

console.log("✅ mock-data generated file matches prototype + codegen script.");
