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

### Writing posts

Posts live in `src/content/posts/<slug>.md` and publish to `/blog/<slug>/`.
Front matter: `title`, `date`, `tags`, `summary`, `draft`, `toc`, `math`
(set `draft: true` to keep a post out of the build). Beyond standard Markdown:

- **Code cards** — every fenced block gets a title bar and a copy button. Use a
  real language (`bash`, `ini`, `python`, …) so Shiki highlights it.
- **Shell sessions** — use `console` for a command *and* its output in one card:
  lines starting with `$` are prompts and the rest are output. A `bash` block is
  treated as all-commands and gets a `$` prompt per line (comments keep their
  `#`). `output`/`log` render as a muted pane; a `bash` block immediately
  followed by an `output` block is drawn as one connected command/output unit.
- **Diagrams** — ` ```mermaid ` fences render client-side (flowcharts, sequence
  diagrams, …).
- **Images** — a paragraph with a single image becomes a `<figure>` captioned
  with the alt text, and clicking it opens a zoom overlay:
  `![Caption text](/images/diagram.png)`.
- **Callouts** — GitHub-style alerts `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`,
  `> [!IMPORTANT]`, `> [!CAUTION]`. Put the body in its own paragraph (a blank
  `>` line after the marker) and optionally a title on the marker line, e.g.
  `> [!TIP] TL;DR`.
- **Math** — set `math: true` in the front matter and use `$…$` / `$$…$$`.

The transforms live in `src/lib/markdown-plugins.mjs` (code chrome, figures,
scrollable tables, callouts) with per-article enhancements in
`src/pages/blog/[slug].astro` (copy button, image zoom, section anchors, Mermaid).

Refresh the certification list from Credly with:

```bash
bun run credly            # prints YAML for src/data/certifications.yaml
bun run credly <username>
```
