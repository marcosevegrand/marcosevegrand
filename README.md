## Hi!

I'm Marco, a software engineering undergrad currently persuing a master's in cybersecurity.

You are welcome to connect with me at:
 · [LinkedIn](https://linkedin.com/in/marcosevegrand)
 · [HackTheBox](https://profile.hackthebox.com/profile/019ed207-d16a-73ea-b364-93cb385a2cf5)
 · [GitHub](https://github.com/marcosevegrand)
 · [Website](https://marcosev.com)
 · [Email](mailto:contact@marcosev.com)

## Development

This site is built with [Astro](https://astro.build) and uses [Bun](https://bun.sh)
as the package manager.

```bash
bun install        # install dependencies
bun run dev        # dev server at http://localhost:4321
bun run build      # production build to ./dist (+ Pagefind search index)
bun run preview    # serve the built site
bun run check      # type-check with astro check
```

Search is powered by [Pagefind](https://pagefind.app), whose index is generated
at build time — so the search box only returns results under `build`/`preview`,
not `dev`.

### Content

- Blog posts: `src/content/posts/*.md` (built into `/blog/<slug>/`)
- Experience & education: `src/data/timeline.yaml`
- Certifications: `src/data/certifications.yaml` (entries may link a Credly
  badge via `credly`, `image` and `href`)
- Site metadata, socials and nav: `src/config.ts`

Refresh the certification list from Credly with:

```bash
bun run credly            # prints YAML for src/data/certifications.yaml
bun run credly <username>
```
