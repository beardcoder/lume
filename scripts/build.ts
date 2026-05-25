import { rmSync } from "node:fs";
import { build } from "esbuild";

try {
  rmSync("./dist", { recursive: true });
} catch {}

const shared = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  target: "es2020",
  platform: "browser" as const,
};

// ESM
await build({
  ...shared,
  outfile: "./dist/lume.js",
  format: "esm",
  sourcemap: true,
});

// CJS
await build({
  ...shared,
  outfile: "./dist/lume.cjs",
  format: "cjs",
  sourcemap: true,
});

// ESM (minified) - for CDN / size reporting
await build({
  ...shared,
  outfile: "./dist/lume.min.js",
  format: "esm",
  minify: true,
  sourcemap: true,
});

console.log("Build complete.");
