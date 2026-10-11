import { SITE } from '../config';

export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', SITE.url).href}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
