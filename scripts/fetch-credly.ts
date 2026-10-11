#!/usr/bin/env bun
/**
 * Fetch the public badges from a Credly profile and print them as YAML entries
 * ready to paste into src/data/certifications.yaml.
 *
 * Usage:
 *   bun run credly                 # defaults to the marcosevegrand profile
 *   bun run credly <username>
 *
 * Entries are printed newest-first by the order Credly returns them. The `kind`
 * is a best-effort guess (training "badges" vs full certifications), and
 * `order` is a simple incrementing index — adjust both as needed.
 */

const username = process.argv[2] ?? 'marcosevegrand';
const endpoint = `https://www.credly.com/users/${username}/badges.json`;

interface CredlyEntity {
  name?: string;
}

interface CredlyIssuer {
  summary?: string;
  entities?: Array<{ entity?: CredlyEntity }>;
}

interface CredlyTemplate {
  name?: string;
  image_url?: string;
  issuer?: CredlyIssuer;
}

interface CredlyBadge {
  id: string;
  issued_at_date?: string;
  public?: boolean;
  state?: string;
  badge_template?: CredlyTemplate;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthYear(iso?: string): string {
  if (!iso) return '';
  const [year, month] = iso.split('-').map(Number);
  return `${MONTHS[(month ?? 1) - 1]} ${year}`;
}

function issuerName(template?: CredlyTemplate): string {
  const named = template?.issuer?.entities?.[0]?.entity?.name;
  if (named) return named;
  return template?.issuer?.summary?.replace(/^issued by /i, '') ?? 'Unknown issuer';
}

const isBadge = (title: string) => /(badge|knowledge)/i.test(title);

const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
if (!response.ok) {
  console.error(`Credly request failed: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const { data } = (await response.json()) as { data: CredlyBadge[] };

const entries = data
  .filter((badge) => badge.public !== false && badge.state !== 'rejected')
  .map((badge, index) => {
    const template = badge.badge_template ?? {};
    const title = template.name ?? 'Untitled badge';
    const lines = [
      `- id: ${JSON.stringify(badge.id)}`,
      `  order: ${index + 1}`,
      `  title: ${JSON.stringify(title)}`,
      `  issuer: ${JSON.stringify(issuerName(template))}`,
      `  date: ${JSON.stringify(monthYear(badge.issued_at_date))}`,
      `  kind: ${isBadge(title) ? 'badge' : 'certification'}`,
      `  credly: ${JSON.stringify(badge.id)}`,
      template.image_url ? `  image: ${JSON.stringify(template.image_url)}` : null,
      `  href: ${JSON.stringify(`https://www.credly.com/badges/${badge.id}/public_url`)}`,
    ].filter((line): line is string => line !== null);
    return lines.join('\n');
  });

console.log(entries.join('\n'));

export {};
