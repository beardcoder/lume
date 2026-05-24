import { rmSync } from "node:fs";
import { build } from "bun";

try {
  rmSync("./dist", { recursive: true });
} catch {}

await build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "esm",
  target: "browser",
  naming: "lume.js",
  minify: false,
  sourcemap: "external",
});

await build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "cjs",
  target: "browser",
  naming: "lume.cjs",
  minify: false,
  sourcemap: "external",
});

console.log("Build complete.");
