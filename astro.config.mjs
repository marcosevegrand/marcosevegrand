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
  // The blog route moved from /posts/ to /blog/. Keep old links working.
  redirects: {
    '/posts': '/blog',
    '/posts/[slug]': '/blog/[slug]',
  },
  integrations: [sitemap()],
  markdown: {
    // Astro 7's default "sätteri" processor adds heading IDs (and exposes them
    // via render()'s `headings`) out of the box, so no rehype-slug is needed.
    // `math` is excluded by default; add `mermaid` so those fences pass through
    // untouched for the client-side renderer (see Base.astro).
    syntaxHighlight: { type: 'shiki', excludeLangs: ['math', 'mermaid'] },
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
  },
});
