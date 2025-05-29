import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from "rollup-plugin-copy";
import preserveDirectives from 'rollup-plugin-preserve-directives';
import terser from '@rollup/plugin-terser';

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
        },
        external: ['react', 'react-dom'],
        plugins: [
            preserveDirectives(),
            terser(),
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
        },
        external: ['elysia'],
        plugins: [
            copy({
                targets: [
                    {
                        src: './migrations',
                        dest: 'dist',
                    }
                ]
            }),
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.server.json' })
        ]
    }
]