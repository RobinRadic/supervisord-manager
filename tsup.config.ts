import { fileURLToPath } from 'node:url';
import { dirname } from 'path';
import { type Options } from 'tsup';
import { type Plugin } from 'esbuild';

const pick = (configs: Options[]) =>
    !process.env[ 'BUILD' ]
    ? configs
    : configs.filter(config => process.env[ 'BUILD' ].split(',').includes(config.name));

const _dirname = dirname(fileURLToPath(import.meta.url));

function tsImportRewritePlugin(ext): Plugin{
    return {
        name: 'rewrite-js-to-ts',
        setup(build) {
            build.onEnd(result => {

                let opt = build.initialOptions;
                debugger
            })

            // build.onResolve({ filter: /.*/ }, (args) => {
            //     debugger
            //     if ( args.importer && args.importer.endsWith('.ts') ) {
            //         return { path: args.path.replace(/\.js$/, ext), namespace: 'file' };
            //     }
            //     return undefined;
            // });
        },
    };
}

const baseConfig: Options = {
    esbuildPlugins: [tsImportRewritePlugin('.mjs')],
    clean: true,
    tsconfig: _dirname+'/tsconfig.build.json',
    target: 'node16',
    sourcemap: true,
    minify: false,
    bundle: false,
    shims: true,
    splitting: false,
    platform: 'node',
    dts: false,
    treeshake: false,
};

const server: Options = {
    ...baseConfig,
    entry: [ 'server/*.ts', 'server/**/*.ts' ],
    name: 'server',
    format: [ 'esm' ],
    outDir: 'dist/server',
    target: 'es2020',
    treeshake: false,
    splitting: true,
    noExternal: [],
    esbuildOptions: (options) => {
        options.chunkNames = 'chunks/[name]-[hash]';
    },
    outExtension: () => ({ js: '.mjs' }),
};


const cli: Options = {
    ...baseConfig,
    entry: [ 'cli/*.ts', 'cli/**/*.ts' ],
    name: 'cli',
    format: [ 'esm' ],
    outDir: 'dist/cli',
    target: 'es2020',
    treeshake: false,
    splitting: true,
    noExternal: [],
    esbuildOptions: (options) => {
        options.chunkNames = 'chunks/[name]-[hash]';
    },
    outExtension: () => ({ js: '.mjs' }),
};

export default pick([ server, cli ]);
