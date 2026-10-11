import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    description: z.string().optional(),
    toc: z.boolean().default(true),
    math: z.boolean().default(false),
  }),
});

/**
 * A single role within a grouped employer entry (e.g. the several roles held at
 * one company). `collapsed: true` hides the role from the list by default and
 * reveals it behind a "show more" toggle, keeping long histories compact.
 */
const role = z.object({
  title: z.string(),
  date: z.string(),
  status: z.enum(['ongoing', 'completed']).default('completed'),
  duration: z.string().optional(),
  employment: z.string().optional(),
  details: z.array(z.string()).default([]),
  collapsed: z.boolean().default(false),
});

const timeline = defineCollection({
  loader: file('./src/data/timeline.yaml'),
  schema: z.object({
    kind: z.enum(['work', 'education']),
    order: z.number().default(0),
    /** Featured entries appear in the site's curated Experience list. */
    featured: z.boolean().default(true),
    /** Sort key (YYYY-MM); entries are shown newest first. */
    start: z.string().optional(),
    status: z.enum(['ongoing', 'completed']).default('completed'),
    // Single-role entries use `title`/`date`; grouped entries leave them out
    // and provide `roles` instead.
    title: z.string().optional(),
    date: z.string().optional(),
    org: z.string(),
    /** Company / institution logo; a monogram placeholder is shown if absent. */
    logo: z.string().optional(),
    meta: z.string().optional(),
    location: z.string().optional(),
    href: z.url().optional(),
    details: z.array(z.string()).default([]),
    roles: z.array(role).default([]),
  }),
});

const certifications = defineCollection({
  loader: file('./src/data/certifications.yaml'),
  schema: z.object({
    order: z.number().default(0),
    title: z.string(),
    issuer: z.string(),
    date: z.string(),
    kind: z.enum(['certification', 'badge']),
    /** Credly badge id, when the certificate is also published on Credly. */
    credly: z.string().optional(),
    /** Badge artwork (usually the Credly CDN image). */
    image: z.url().optional(),
    /** Canonical verification link (usually the public Credly badge page). */
    href: z.url().optional(),
  }),
});

export const collections = { posts, timeline, certifications };
