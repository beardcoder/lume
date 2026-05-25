import { rmSync } from "node:fs";

try {
  rmSync("./dist", { recursive: true });
} catch {}

// ESM
const esmResult = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "browser",
  format: "esm",
  naming: "lume.js",
});

if (!esmResult.success) {
  console.error("ESM build failed:", esmResult.logs);
  process.exit(1);
}

// CJS
const cjsResult = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "browser",
  format: "cjs",
  naming: "lume.cjs",
});

if (!cjsResult.success) {
  console.error("CJS build failed:", cjsResult.logs);
  process.exit(1);
}

// ESM (minified) - for CDN / size reporting
const minResult = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "browser",
  format: "esm",
  naming: "lume.min.js",
  minify: true,
});

if (!minResult.success) {
  console.error("Minified build failed:", minResult.logs);
  process.exit(1);
}

console.log("Build complete.");
