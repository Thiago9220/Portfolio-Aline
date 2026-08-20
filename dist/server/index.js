function withCanonicalMetadata(html, requestUrl) {
  const canonicalUrl = `${requestUrl.origin}${requestUrl.pathname}`;
  const socialImage = `${requestUrl.origin}/assets/og-card.jpg`;

  return html
    .replaceAll('content="assets/og-card.jpg"', `content="${socialImage}"`)
    .replace('</head>', `  <link rel="canonical" href="${canonicalUrl}">\n</head>`);
}

function createSitemap(origin) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>${origin}/en.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/robots.txt') {
      return new Response(`User-agent: *\nAllow: /\nSitemap: ${url.origin}/sitemap.xml\n`, {
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      });
    }

    if (url.pathname === '/sitemap.xml') {
      return new Response(createSitemap(url.origin), {
        headers: { 'content-type': 'application/xml; charset=utf-8' }
      });
    }

    if (url.pathname === '/') url.pathname = '/index.html';

    const assetResponse = await env.ASSETS.fetch(new Request(url, request));
    const contentType = assetResponse.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) return assetResponse;

    const html = withCanonicalMetadata(await assetResponse.text(), new URL(request.url));
    const headers = new Headers(assetResponse.headers);
    headers.set('content-type', 'text/html; charset=utf-8');

    return new Response(html, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers
    });
  }
};
