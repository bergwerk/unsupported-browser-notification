import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
    {
        input: 'src/index.umd.js',
        output: {
            file: 'dist/notification.umd.js',
            format: 'umd',
            sourcemap: true,
            name: 'UnsupportedBrowserNotification'
        },
        plugins: [
            resolve(),
            babel({
                babelHelpers: 'bundled',
            }),
            production && terser()
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/notification.js',
            format: 'iife',
            sourcemap: true,
        },
        plugins: [
            resolve(),
            babel({
                babelHelpers: 'bundled',
                presets: [
                    ['@babel/env', {
                        targets: {
                            browsers: '> 1%, IE 11, not op_mini all, not dead'
                        }
                    }]
                ]
            }),
            production && terser()
        ]
    }
]
