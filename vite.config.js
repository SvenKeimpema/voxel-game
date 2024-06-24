import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/main.css',
                'resources/css/server_menu.css',
                'resources/css/game/main.css',
                'resources/js/app.js',
                'resources/js/voxel_game/main.js'
            ],
            refresh: true,
        }),
    ],

    optimizeDeps: {
        exclude: ["midsommer"],
    },
    server: {
        host: "localhost",
        hmr: {
          host: 'localhost'
        }
    },
});
