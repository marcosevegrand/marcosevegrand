// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { markdownPlugins } from './src/lib/markdown-plugins.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://marcosev.com/',
  // Hugo already uses ./static as its static directory. Pointing Astro's public
  // dir at the same folder keeps both generators working with a single copy of
  // cv/, images/, favicon.svg, CNAME, etc. (./public is gitignored.)
  publicDir: './static',
  trailingSlash: 'ignore',
  // The blog route moved from /posts/ to /blog/. Keep old links working.
  redirects: {
    '/posts': '/blog',
    '/posts/[slug]': '/blog/[slug]',
  },
  integrations: [sitemap()],
  markdown: {
    // Sätteri is Astro's native Markdown pipeline. Our HAST plugins add code
    // chrome, figure captions, scrollable tables and callouts (see
    // src/lib/markdown-plugins.mjs). Heading IDs come from the processor, and
    // `mermaid`/`math` fences pass through untouched for the client renderer.
    processor: satteri({ hastPlugins: markdownPlugins }),
    syntaxHighlight: { type: 'shiki', excludeLangs: ['math', 'mermaid'] },
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
  },
});
