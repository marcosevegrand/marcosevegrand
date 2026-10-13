import { defineHastPlugin } from 'satteri';

/**
 * Sätteri HAST plugins that turn plain Markdown into richer article markup.
 *
 * These run after Shiki highlighting but before Astro's image/heading-id
 * passes (see `@astrojs/markdown-satteri`). They are deliberately dependency
 * free and handle both the `className` (hast) and `class` (materialized)
 * spellings of the class attribute.
 */

/** Read a class list from either `className: []` or `class: "a b"`. */
function classes(value) {
  if (Array.isArray(value)) return value.filter((entry) => typeof entry === 'string');
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
  return [];
}

/** Languages rendered as a shell/terminal session. */
const TERMINAL_LANGS = new Set([
  'bash',
  'sh',
  'shell',
  'zsh',
  'fish',
  'console',
  'shellsession',
  'powershell',
  'ps1',
  'ps',
  'cmd',
  'bat',
  'dosbatch',
]);

/** Languages rendered as command output (muted, no prompt). */
const OUTPUT_LANGS = new Set(['output', 'log']);

/** Languages we must not wrap because a client-side renderer owns them. */
const PASSTHROUGH_LANGS = new Set(['mermaid', 'math']);

/** Fence languages that already contain their own prompt character. */
const PROMPTED_LANGS = new Set(['console', 'shellsession']);

const LANG_LABELS = {
  console: 'console',
  shellsession: 'shell',
  sh: 'shell',
  zsh: 'zsh',
  fish: 'fish',
  ps1: 'powershell',
  ps: 'powershell',
  cmd: 'cmd',
  bat: 'batch',
  dosbatch: 'batch',
  txt: 'text',
  plaintext: 'text',
  output: 'output',
  log: 'log',
};

const label = (lang) => LANG_LABELS[lang] ?? (lang || 'text');

const text = (value) => ({ type: 'text', value });
const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });

/**
 * Wrap every fenced code block in a card with a title bar (traffic-light dots,
 * language label, copy button). Shell/console blocks additionally get per-line
 * classes so CSS can show a `$` prompt on commands and mute their output.
 */
export const rehypeCodeBlocks = defineHastPlugin({
  name: 'code-blocks',
  element: {
    filter: ['pre'],
    visit(node, ctx) {
      const props = node.properties ?? {};
      const code = (node.children ?? []).find(
        (child) => child.type === 'element' && child.tagName === 'code',
      );

      let lang = String(props.dataLanguage ?? props['data-language'] ?? '');
      if (!lang && code) {
        const langClass = classes(code.properties?.className ?? code.properties?.class).find((entry) =>
          entry.startsWith('language-'),
        );
        if (langClass) lang = langClass.slice('language-'.length);
      }
      lang = lang.toLowerCase();

      if (PASSTHROUGH_LANGS.has(lang)) return;

      const isTerminal = TERMINAL_LANGS.has(lang);
      const isOutput = OUTPUT_LANGS.has(lang);

      let body = code;
      if (code && isTerminal) {
        const prompted = PROMPTED_LANGS.has(lang);
        const codeClasses = classes(code.properties?.className ?? code.properties?.class);
        body = el(
          'code',
          codeClasses.length ? { className: codeClasses } : {},
          (code.children ?? []).map((child) => {
            if (
              child.type !== 'element' ||
              !classes(child.properties?.className ?? child.properties?.class).includes('line')
            ) {
              return child;
            }
            const lineText = ctx.textContent(child);
            const lineClasses = ['line'];
            if (/^\s*#/.test(lineText)) lineClasses.push('ln-cmt');
            else if (/^\s*[$>❯]\s?/.test(lineText)) lineClasses.push('ln-cmd');
            else if (prompted) lineClasses.push('ln-out');
            else if (lineText.trim() !== '') lineClasses.push('ln-cmd-auto');
            return el('span', { className: lineClasses }, child.children ?? []);
          }),
        );
      }

      const pre = el(
        'pre',
        { ...props },
        body ? [body] : node.children ?? [],
      );

      const head = el('div', { className: ['code-head'] }, [
        el('span', { className: ['code-dots'], ariaHidden: 'true' }, [
          el('span', { className: ['code-dot'] }),
          el('span', { className: ['code-dot'] }),
          el('span', { className: ['code-dot'] }),
        ]),
        el('span', { className: ['code-lang'] }, [text(label(lang))]),
        el(
          'button',
          { type: 'button', className: ['code-copy'], dataCopy: '', 'aria-label': `Copy ${label(lang)} block` },
          [text('Copy')],
        ),
      ]);

      const wrapper = ['code-block'];
      if (isTerminal) wrapper.push('is-terminal');
      if (isOutput) wrapper.push('is-output');

      return el('div', { className: wrapper }, [head, pre]);
    },
  },
});

/**
 * Turn a paragraph containing a single image into a `<figure>` with an optional
 * caption (taken from the alt text) and a link for the click-to-zoom lightbox.
 */
export const rehypeFigures = defineHastPlugin({
  name: 'figures',
  element: {
    filter: ['p'],
    visit(node) {
      const children = node.children ?? [];
      if (children.some((child) => child.type === 'text' && child.value.trim() !== '')) return;
      const images = children.filter((child) => child.type === 'element');
      if (images.length !== 1 || images[0].tagName !== 'img') return;

      const img = images[0];
      const props = img.properties ?? {};
      const src = typeof props.src === 'string' ? props.src : '';
      if (!src) return;
      const alt = typeof props.alt === 'string' ? props.alt.trim() : '';

      const zoom = el(
        'a',
        { className: ['image-zoom'], href: src, dataZoom: '' },
        [el('img', { ...props, loading: 'lazy', decoding: 'async' })],
      );

      const figure = [zoom];
      if (alt) figure.push(el('figcaption', { className: ['figcaption'] }, [text(alt)]));

      return el('figure', { className: ['figure'] }, figure);
    },
  },
});

/** Wrap wide tables so they scroll horizontally instead of breaking layout. */
export const rehypeTables = defineHastPlugin({
  name: 'tables',
  element: {
    filter: ['table'],
    visit(node) {
      return el('div', { className: ['table-wrap'] }, [node]);
    },
  },
});

const CALLOUT_ICONS = {
  note: 'ℹ',
  tip: '✦',
  warning: '⚠',
  important: '❗',
  caution: '⛔',
};

/**
 * GitHub-style alerts: a blockquote that starts with `[!NOTE]` (or TIP,
 * WARNING, IMPORTANT, CAUTION) becomes a styled callout. Put the body on its
 * own paragraph, i.e. a blank `>` line after the marker.
 */
export const rehypeCallouts = defineHastPlugin({
  name: 'callouts',
  element: {
    filter: ['blockquote'],
    visit(node, ctx) {
      const children = node.children ?? [];
      const first = children.find((child) => child.type === 'element' && child.tagName === 'p');
      if (!first) return;

      const match = ctx.textContent(first).match(/^\[!(\w+)\]\s*(.*)$/s);
      if (!match) return;
      const type = match[1].toLowerCase();
      if (!(type in CALLOUT_ICONS)) return;

      const heading = match[2].trim() || type.charAt(0).toUpperCase() + type.slice(1);
      const rest = children.filter((child) => child !== first);
      const title = el('p', { className: ['callout-title'] }, [text(heading)]);

      return el('div', { className: ['callout', `callout-${type}`] }, [title, ...rest]);
    },
  },
});

/** All article plugins, in run order. */
export const markdownPlugins = [rehypeCallouts, rehypeCodeBlocks, rehypeFigures, rehypeTables];
