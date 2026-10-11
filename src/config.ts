// Single source of truth for site-wide metadata, ported from hugo.yaml.

export interface Social {
  label: string;
  href: string;
}

export interface MenuItem {
  name: string;
  href: string;
  weight: number;
}

export const SITE = {
  url: 'https://marcosev.com/',
  title: 'Marco Sèvegrand',
  locale: 'en',
  timeZone: 'Europe/Lisbon',
  description:
    'Personal website of Marco Sèvegrand, a software engineer focused on cybersecurity, infrastructure, networks and systems architecture.',
  author: 'Marco Sèvegrand',
  role: 'Software Engineer',
  location: 'Braga, Portugal',
  dateFormat: '02-01-2006',
  resume: '/cv/resume.pdf',
  ogImage: '/og-image.svg',
} as const;

export const SOCIALS: Social[] = [
  { label: 'GitHub', href: 'https://github.com/marcosevegrand' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/marcosevegrand' },
  {
    label: 'HackTheBox',
    href: 'https://profile.hackthebox.com/profile/019ed207-d16a-73ea-b364-93cb385a2cf5',
  },
  { label: 'Credly', href: 'https://www.credly.com/users/marcosevegrand' },
  { label: 'Email', href: 'mailto:contact@marcosev.com' },
];

export const MENU: MenuItem[] = [
  { name: 'Blog', href: '/blog', weight: 10 },
  { name: 'About', href: '/about', weight: 20 },
  { name: 'Resume', href: '/cv/resume.pdf', weight: 30 },
];

/** Formats a date using the site's configured DD-MM-YYYY pattern. */
export function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}
