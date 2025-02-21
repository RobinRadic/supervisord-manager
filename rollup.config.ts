import resolve from '@rollup/plugin-node-resolve';
// noinspection ES6UnusedImports
import ts from '@rollup/plugin-typescript';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'path';
import { RollupOptions } from 'rollup';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';


// Recursively get all TypeScript files from src/
const getAllTSFiles = (dir) => {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const res = join(dir, entry.name);
        return entry.isDirectory() ? getAllTSFiles(res) : (res.endsWith('.ts') && !res.endsWith('.d.ts')) ? res : [];
    });
};
const _dirname      = dirname(fileURLToPath(import.meta.url));

const config: RollupOptions[] = [ {
    input: getAllTSFiles('server').concat(getAllTSFiles('cli')),
    output: {
        dir: './dist',
        format: 'esm',
        entryFileNames: '[name].mjs',
        sourcemap: true,
        preserveModules: true,
    },
    treeshake: false,
    external: /.*node_modules.*/,
    plugins: [
        del({ targets: [ './dist/server', './dist/cli' ] }),
        resolve(),
        ts({
            tsconfig: join(_dirname, 'tsconfig.build.json'),
            outDir: './dist',
        }),
        copy({
            targets: [
                { src: 'server/views/**/*', dest: 'dist/server/views' },
            ],
        }),
    ],
} ];

export default config;
