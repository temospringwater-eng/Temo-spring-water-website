'use strict';
// Run: node --test tests/water-effects.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const pages = ['index.html', 'about.html', 'products.html', 'contact.html'];
const css = read('water-effects.css');
const js = read('water-effects.js');

for (const page of pages) {
  test(`${page}: decorative water is isolated, assets linked and SEO source present`, () => {
    const html = read(page);
    assert.match(html, /<link rel="stylesheet" href="\/?water-effects\.css">/);
    assert.match(html, /<script src="\/?water-effects\.js" defer><\/script>/);
    assert.match(html, /data-temo-water aria-hidden="true"/);
    assert.match(html, /<meta name="viewport"/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /<meta name="description"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/class="temo-water-drop"/g) || []).length, page === 'index.html' ? 10 : 5);
  });
}
test('CSS preserves clicks, mobile limits and reduced-motion fallback', () => {
  assert.match(css, /pointer-events:none/);
  assert.match(css, /@media\(max-width:767px\)/);
  assert.match(css, /nth-child\(n\+6\)\{display:none\}/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /\.page-hero>\.container\{position:relative;z-index:1\}/);
});
test('JS pauses effects when tab hidden, offscreen, or reduced motion', () => {
  assert.match(js, /visibilitychange/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /is-paused/);
});
