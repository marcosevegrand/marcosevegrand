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
 * one company). Secondary roles are listed compactly beneath the entry.
 */
const role = z.object({
  title: z.string(),
  date: z.string(),
  status: z.enum(['ongoing', 'completed']).default('completed'),
  /** Total time in the role, e.g. "9 mos". */
  duration: z.string().optional(),
  /** Work type: part-time, full-time, internship, volunteering, ... */
  employment: z.string().optional(),
  /** Work style: on-site, hybrid, remote. */
  style: z.string().optional(),
  details: z.array(z.string()).default([]),
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
    /** Employment type, e.g. "Part-time". */
    employment: z.string().optional(),
    /** Total time, e.g. "9 mos". */
    duration: z.string().optional(),
    /** Work style: on-site, hybrid, remote. */
    style: z.string().optional(),
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
    kind: z.enum(['certification', 'course', 'badge']),
    /** Credly badge id, when the certificate is also published on Credly. */
    credly: z.string().optional(),
    /** Artwork: a Credly CDN URL or a local asset path (e.g. "/images/x.png"). */
    image: z.string().optional(),
    /** Canonical verification link (usually the public Credly badge page). */
    href: z.url().optional(),
  }),
});

/**
 * A single outbound link attached to a project (repository, demo, PDF, post…).
 */
const projectLink = z.object({
  /** Shown only on secondary links; the first link is rendered as the title. */
  label: z.string().optional(),
  href: z.string(),
  kind: z.enum(['repo', 'demo', 'post', 'pdf', 'doc']).optional(),
});

const projects = defineCollection({
  loader: file('./src/data/projects.yaml'),
  schema: z.object({
    order: z.number().default(0),
    title: z.string(),
    kind: z.enum(['code', 'tool', 'coursework', 'report', 'writeup', 'talk']),
    date: z.string().optional(),
    /** Featured projects are surfaced first within their group. */
    featured: z.boolean().default(false),
    summary: z.string(),
    /** Course/project grade, e.g. "18/20". */
    grade: z.string().optional(),
    /** A single linked highlight line, e.g. "Featured at the ES3A Workshop". */
    highlight: z.object({ text: z.string(), href: z.string() }).optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['ongoing', 'complete', 'archived']).default('complete'),
    links: z.array(projectLink).default([]),
  }),
});

export const collections = { posts, timeline, certifications, projects };
