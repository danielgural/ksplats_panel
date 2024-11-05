import r from "@rollup/plugin-node-resolve";
import _ from "@vitejs/plugin-react";
import { promises as a } from "node:fs";
import { join as n } from "node:path";
import { defineConfig as s } from "vite";
import { externalizeDeps as l } from "vite-plugin-externalize-deps";
const t = [
  "@fiftyone/components",
  "@fiftyone/operators",
  "@fiftyone/state",
  "@fiftyone/utilities",
  "@fiftyone/spaces",
  "@fiftyone/plugins",
  "@fiftyone/aggregations",
  "@fiftyone/core",
  "@fiftyone/embeddings",
  "@fiftyone/looker",
  "@fiftyone/map",
  "@fiftyone/playback",
  "@fiftyone/spotlight",
  "@fiftyone/flashlight",
  "@fiftyone/looker-3d",
  "@mui/material",
  "styled-components",
  "recoil",
  "react",
  "react-dom"
];
async function c(o) {
  const e = n(o, "package.json"), i = await a.readFile(e, "utf-8");
  return JSON.parse(i);
}
function m() {
  const { FIFTYONE_DIR: o } = process.env;
  if (!o)
    throw new Error(
      "FIFTYONE_DIR environment variable not set. This is required to resolve @fiftyone/* imports."
    );
  return {
    name: "fiftyone-bundle-private-packages",
    enforce: "pre",
    resolveId: (e) => {
      if (e.startsWith("@fiftyone") && !t.includes(e)) {
        const i = e.split("/")[1], f = `${o}/app/packages/${i}`;
        return this.resolve(f, e, { skipSelf: !0 });
      }
      return null;
    }
  };
}
async function v(o, e = {}) {
  const i = await c(o);
  return s({
    mode: "development",
    plugins: [
      m(),
      r(),
      _({ jsxRuntime: "classic" }),
      l({
        deps: !0,
        devDeps: !1,
        useFile: n(process.cwd(), "package.json"),
        // we want to bundle in the following dependencies and not rely on
        // them being available in the global scope
        except: (e == null ? void 0 : e.forceBundleDependencies) ?? [],
        include: t
      }),
      ...(e == null ? void 0 : e.plugins) ?? []
    ],
    build: {
      minify: !0,
      lib: {
        entry: n(o, i.main),
        name: i.name,
        fileName: (f) => `index.${f}.js`,
        formats: ["umd"]
      },
      rollupOptions: {
        output: {
          globals: {
            react: "React",
            recoil: "recoil",
            "react-dom": "ReactDOM",
            "jsx-runtime": "jsx",
            "react/jsx-runtime": "jsx",
            "@fiftyone/state": "__fos__",
            "@fiftyone/plugins": "__fop__",
            "@fiftyone/operators": "__foo__",
            "@fiftyone/components": "__foc__",
            "@fiftyone/utilities": "__fou__",
            "@fiftyone/spaces": "__fosp__",
            "@fiftyone/aggregations": "__foa__",
            "@fiftyone/core": "__focore__",
            "@fiftyone/embeddings": "__foe__",
            "@fiftyone/looker": "__fol__",
            "@fiftyone/map": "__fom__",
            "@fiftyone/playback": "__fopb__",
            "@fiftyone/spotlight": "__fosl__",
            "@fiftyone/flashlight": "__fof__",
            "@fiftyone/looker-3d": "__fol3d__",
            "@mui/material": "__mui__",
            "styled-components": "__styled__"
          }
        }
      },
      ...(e == null ? void 0 : e.buildConfigOverride) ?? {}
    },
    define: {
      "process.env.NODE_ENV": '"development"'
    },
    optimizeDeps: {
      exclude: ["react", "react-dom"]
    }
  });
}
export {
  v as defineConfig
};
