import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from "rollup-plugin-copy";

export default [
    {
        input: 'front/index.ts',
        output: {
            dir: 'dist/front',
            format: 'esm',
            sourcemap: true,
            preserveModules: true
        },
        external: ['react', 'react-dom'],
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.front.json' })
        ]
    },
    {
        input: 'app/index.ts',
        output: {
            dir: 'dist/app',
            format: 'esm',
            sourcemap: true,
            preserveModules: true
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
            typescript({ tsconfig: './tsconfig.app.json' })
        ]
    }
]