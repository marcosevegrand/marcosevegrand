import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Newest first. */
export function byDateDesc(a: Post, b: Post): number {
  return (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0);
}

/** Hugo-like urlize for tag slugs. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

/**
 * Plain-text excerpt for list pages and the RSS feed. Prefers the explicit
 * `summary` front matter (mirroring Hugo's `.Summary` behaviour) and otherwise
 * derives a short preview from the raw Markdown body.
 */
export function postExcerpt(entry: Post, length = 200): string {
  if (entry.data.summary) return entry.data.summary;

  const text = (entry.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}
