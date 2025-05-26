import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'client/index.ts',
        output: {
            dir: 'dist/client',
            format: 'esm',
            sourcemap: true,
            preserveModules: true
        },
        external: ['react', 'react-dom', '@core'],
        plugins: [
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