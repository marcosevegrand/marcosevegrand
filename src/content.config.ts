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

const timeline = defineCollection({
  loader: file('./src/data/timeline.yaml'),
  schema: z.object({
    kind: z.enum(['work', 'education']),
    order: z.number().default(0),
    date: z.string(),
    title: z.string(),
    org: z.string(),
    href: z.url().optional(),
    details: z.array(z.string()).default([]),
  }),
});

const certifications = defineCollection({
  loader: file('./src/data/certifications.yaml'),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: z.string(),
    kind: z.enum(['certification', 'badge']),
    order: z.number().default(0),
  }),
});

export const collections = { posts, timeline, certifications };
