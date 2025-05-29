import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import preserveDirectives from "rollup-plugin-preserve-directives";

export default [
    {
        onwarn(warning, warn) {
            if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') {
                warn(warning);
            }
        },
        input: 'client/index.ts',
        output: {
            dir: 'dist/client',
            format: 'esm',
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: 'client'
        },
        external: ['react', 'react-dom', '@core'],
        plugins: [
            preserveDirectives({suppressPreserveModulesWarning: true}),
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.client.json' })
        ]
    },
    {
        input: 'server/index.ts',
        output: {
            dir: 'dist/server',
            format: 'esm',
            sourcemap: true,
            preserveModules: true
        },
        external: ['elysia'],
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.server.json' })
        ]
    },
    {
        input: 'hybrid/index.ts',
        output: {
            dir: 'dist/hybrid',
            format: 'esm',
            sourcemap: true,
            preserveModules: true
        },
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.hybrid.json' })
        ]
    }
]