import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";
import { createRequire } from "node:module";

const requireFile = createRequire(import.meta.url);
const packageJson = requireFile("./package.json");

export default [
    {
        input: `src/index.ts`,
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                assetFileNames: "[name]-[hash][extname]",
            },
            {
                file: packageJson.module,
                format: "esm",
                assetFileNames: "[name]-[hash][extname]",
            },
        ],
        plugins: [
            del({
                targets: `dist/`,
                hook: "buildStart",
            }),
            resolve({
                browser: true,
                preferBuiltins: true
            }),
            commonjs(),
            typescript({
                exclude: [
                    "**/*.test.tsx",
                    "**/*.test.ts",
                    "**/*.stories.tsx",
                    "src/components/sources.tsx",
                    "src/components/connection-manager.tsx",
                ],
            }),
        ],
    },
    {
        input: `dist/types/index.d.ts`,
        output: [{ file: packageJson.types, format: "es" }],
        plugins: [
            dts(),
            del({
                targets: `dist/types/`,
                hook: "buildEnd",
            }),
        ],
    },
];
