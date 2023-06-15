import { sveltekit } from '@sveltejs/kit/vite';
import type { defineConfig  } from 'vite';

const config: defineConfig  = {
	plugins: [sveltekit()],
    build: {
        rollupOptions: {
            external: [
                "/src/routes/admin/"
            ]
        }
    }
};

export default config;
