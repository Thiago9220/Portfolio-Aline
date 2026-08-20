import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../worker/index.js';

const sampleHtml = '<html><head><meta property="og:image" content="assets/og-card.jpg"></head><body></body></html>';
const env = {
  ASSETS: {
    fetch: async () => new Response(sampleHtml, {
      headers: { 'content-type': 'text/html' }
    })
  }
};

test('injects absolute social image and canonical metadata', async () => {
  const response = await worker.fetch(new Request('https://portfolio.example/'), env);
  const html = await response.text();

  assert.match(html, /https:\/\/portfolio\.example\/assets\/og-card\.jpg/);
  assert.match(html, /rel="canonical" href="https:\/\/portfolio\.example\/"/);
});

test('serves robots and sitemap from the current origin', async () => {
  const robots = await (await worker.fetch(new Request('https://portfolio.example/robots.txt'), env)).text();
  const sitemap = await (await worker.fetch(new Request('https://portfolio.example/sitemap.xml'), env)).text();

  assert.match(robots, /https:\/\/portfolio\.example\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/portfolio\.example\/en\.html/);
});
