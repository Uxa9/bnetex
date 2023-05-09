import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    css: {
        postcss: {
            plugins: [
                autoprefixer({}), // add options if needed
            ],
        },
    },
    resolve: {
        alias: [
            {
                find: 'config',
                replacement: resolve(__dirname, 'src/config'),
            },
            {
                find: 'lib',
                replacement: resolve(__dirname, 'src/lib'),
            },
            {
                find: 'styles',
                replacement: resolve(__dirname, 'src/styles'),
            },
            {
                find: 'routes',
                replacement: resolve(__dirname, 'src/routes'),
            },
            {
                find: 'modules',
                replacement: resolve(__dirname, 'src/modules'),
            },
            {
                find: 'services',
                replacement: resolve(__dirname, 'src/services'),
            },
            {
                find: 'store',
                replacement: resolve(__dirname, 'src/store'),
            },
            {
                find: 'assets',
                replacement: resolve(__dirname, 'src/assets'),
            },
        ],
    },
});
