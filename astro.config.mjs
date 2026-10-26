// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://marcosev.com/',
  // Hugo already uses ./static as its static directory. Pointing Astro's public
  // dir at the same folder keeps both generators working with a single copy of
  // cv/, images/, favicon.svg, CNAME, etc. (./public is gitignored.)
  publicDir: './static',
  trailingSlash: 'ignore',
  // The bio now lives on the landing page; keep old links working.
  redirects: {
    '/about': '/',
    '/blog': '/',
    '/posts': '/',
  },
  integrations: [sitemap()],
});
