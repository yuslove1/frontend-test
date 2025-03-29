import esbuild from 'esbuild'
// const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["node_modules/pdfjs-dist/build/pdf.worker.mjs"],
    outfile: "public/pdf.worker.js",
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "esnext",
  })
  .then(() => console.log("Worker bundled successfully!"))
  .catch((error) => {
    console.error("Bundling failed:", error);
    process.exit(1);
  });