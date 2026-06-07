import { rmSync } from "node:fs";
import { gzipSync } from "node:zlib";

try {
  rmSync("./dist", { recursive: true });
} catch {}

type Target = {
  label: string;
  naming: string;
  format: "esm" | "cjs";
  minify?: boolean;
};

const targets: Target[] = [
  { label: "ESM", naming: "lume.js", format: "esm" },
  { label: "CJS", naming: "lume.cjs", format: "cjs" },
  // ESM (minified) — for CDN / size reporting.
  { label: "ESM (min)", naming: "lume.min.js", format: "esm", minify: true },
];

const formatBytes = (bytes: number) => `${(bytes / 1024).toFixed(2)} kB`;

for (const { label, naming, format, minify } of targets) {
  const result = await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "browser",
    format,
    naming,
    minify,
  });

  if (!result.success) {
    console.error(`${label} build failed:`, result.logs);
    process.exit(1);
  }

  const raw = await Bun.file(`./dist/${naming}`).bytes();
  const gzipped = gzipSync(raw).length;
  console.log(
    `${label.padEnd(9)} ${naming.padEnd(12)} ${formatBytes(raw.length).padStart(9)}  →  ${formatBytes(gzipped).padStart(9)} gzipped`
  );
}

console.log("Build complete.");
