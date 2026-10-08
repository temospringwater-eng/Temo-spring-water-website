# TEMO Water Animation — Phase 5 SEO & Accessibility Source Audit

Date: 2026-10-08. Scope: feature branch only. Not a Lighthouse, screen-reader, browser, crawler, or production audit.

## Verified from feature-branch source
| Page | Canonical | Title/description | H1 count | Water layer |
| --- | --- | --- | ---: | --- |
| index.html | https://www.temospringwater.com/ | Present | 1 | aria-hidden |
| about.html | https://www.temospringwater.com/about | Present | 1 | aria-hidden |
| products.html | https://www.temospringwater.com/products | Present | 1 | aria-hidden |
| contact.html | https://www.temospringwater.com/contact | Present | 1 | aria-hidden |

- Decorative water is CSS/HTML, not a canvas or replacement for textual content.
- CSS declares pointer-events:none for the effect container.
- Page-hero content is stacked above the effect.
- CSS supplies a reduced-motion override and script listens for the preference and visibility changes.
- JSON-LD is present on the homepage; no requirement to add it to all pages.
- Contact page retains one form. Functional submission **not tested**.
- Canonical page paths above are source values only; redirect/resolution and Google indexing signals **not verified**.

## Acceptance checks still required in a real preview/browser
- [ ] At widths 320, 360, 390, 768, 1280px check overlap and text contrast (WCAG AA, 4.5:1 body / 3:1 large text).
- [ ] Keyboard-only navigation: focus indicators and all buttons/form controls remain reachable.
- [ ] Reduced-motion simulation results in no moving droplets.
- [ ] Browser accessibility tree excludes effect layers but includes headings, product content and form labels.
- [ ] Contact form successfully submits and announces validation errors.
- [ ] Lighthouse accessibility, performance and SEO reports recorded for baseline and feature branch.
- [ ] Canonical URL network requests/redirects checked separately before any indexing conclusions.
- [ ] Sitemap and robots references examined as part of separate site-wide SEO audit.
- [ ] Mobile testing on real Android or responsive devtools.

## Release gate
No merge, no preview deployment claim, and no production deployment until browser QA passes and user approves. Remove effect asset links/markup to roll back.
