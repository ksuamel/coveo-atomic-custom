import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

/** @type {import("rollup").GlobalsOption} */
const globals = {
  react: "React",
  "react-dom": "ReactDOM",
  "react-dom/client": "ReactDOM",
  "react-dom/server": "ReactDOMServer",
  "@coveo/atomic": "CoveoAtomic",
  "@coveo/headless": "CoveoHeadless",
};

/** @type {import('rollup').ExternalOption} */
const commonExternal = [
  "react",
  "react-dom",
  "react-dom/client",
  "react-dom/server",
  "@coveo/atomic",
  "@coveo/headless",
];

/** @returns {import('rollup').OutputOptions} */
const outputIIFE = ({ minify }) => ({
  file: `dist/iife/custom-atomic-react${minify ? ".min" : ""}.js`,
  format: "iife",
  name: "CustomAtomicReact",
  globals,
  plugins: minify ? [terser()] : [],
});

const plugins = [
  nodePolyfills(),
  typescript({ tsconfig: "tsconfig.iife.json", sourceMap: !production }),
  commonjs(),
  nodeResolve(),
  replace({
    delimiters: ["", ""],
    values: {
      "process.env.NODE_ENV": JSON.stringify("dev"),
      "util.TextEncoder();": "TextEncoder();",
      "import { defineCustomElements } from '@jcore/atomic/loader';": "",
      "defineCustomElements();": "",
    },
    preventAssignment: true,
  }),
];

export default defineConfig([
  {
    input: "lib/index.ts",
    output: [
      outputIIFE({ minify: true, sourcemap: !production }),
      outputIIFE({ minify: false, sourcemap: !production }),
    ],
    external: commonExternal,
    plugins,
  },
]);
