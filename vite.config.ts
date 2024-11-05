import { defineConfig } from "@voxel51/fiftyone-js-plugin-build";
import { dirname } from "path";
import { fileURLToPath } from "url";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dir = __dirname;

// note: enable these again when we use rerun webviewer and not iframe
const myPluginThirdPartyDependencies = [
  "@mkkellogg/gaussian-splats-3d",
  "three",
  "lru-cache",
  // /^@rerun-io.*/,
  // "lru-cache"
];

export default defineConfig(dir, {
  forceBundleDependencies: myPluginThirdPartyDependencies,
  plugins: [wasm(), topLevelAwait()],
});