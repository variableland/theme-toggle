import biome from "@rrlab/biome-plugin";
import { defineConfig } from "@rrlab/cli/config";
import oxc from "@rrlab/oxc-plugin";
import tsdown from "@rrlab/tsdown-plugin";
import vitest from "@rrlab/vitest-plugin";

export default defineConfig({
  plugins: [biome(), oxc({ only: ["typecheck"] }), vitest(), tsdown()],
});
