import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL ?? 'https://marcosev.com';

export default defineConfig({
  site,
  base: '/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
