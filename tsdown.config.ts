import { defineLibConfig } from "@rrlab/tsdown-config";
import { defineConfig } from "tsdown";

export default defineConfig([
  defineLibConfig(),
  defineConfig({
    format: "iife",
    entry: ["src/initial.ts"],
    minify: true,
    outputOptions: {
      entryFileNames: "[name].js",
    },
  }),
]);
