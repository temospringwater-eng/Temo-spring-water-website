# TEMO Water Effects — Phase 4 QA Checklist

Scope: homepage, about, products and contact. Test **feature/temo-water-effects-phase1-2** only. **Do not merge into main or deploy to production** until approved.

## Prerequisite
Run a local static server against the feature branch; a GitHub source file view is NOT a rendered preview. Open all four pages in mobile browser/devtools. Do not assume a Cloudflare preview exists.

## Responsive + interaction checks
- [ ] 320px / 360px / 390px / 768px / 1280px widths: no horizontal scrolling or overlap.
- [ ] Text, heading and navigation links contrast remain accessible over effects.
- [ ] Contact form fields, submit button, and any success/error states remain clickable and functional.
- [ ] Mobile navigation opens and closes; Whatsapp/order links remain accessible.
- [ ] Products cards and CTAs are visible and not covered by decorative layers.
- [ ] Only 5 droplets display at widths <=767px; 10 on desktop homepage.
- [ ] No DOM/CSS/JS errors in browser console.

## Animation + accessibility
- [ ] Background droplets flow visibly without distracting from headings.
- [ ] Reduced-motion preference disables flowing motion, retaining a calm static layer.
- [ ] Switching browser tabs pauses animations and resumes on return.
- [ ] Offscreen hero pauses animation if IntersectionObserver is supported.
- [ ] Decorative layers cannot capture pointer events; keyboard focus remains visible.
- [ ] Text remains ordinary selectable/accessible HTML, not rendered as a canvas or video.

## Performance (record actual before/after values)
- [ ] Lighthouse Mobile and Desktop on the same page and same test settings.
- [ ] Record LCP, CLS, INP (field measurement if available), total blocking time and transferred CSS/JS.
- [ ] Confirm no increase in CLS attributable to effects and no significant LCP regression.
- [ ] Inspect mobile FPS/long tasks on a lower-end Android device; lower opacity/count or disable effects when needed.
- [ ] Test on slow network and data saver.

## Rollback
Remove water-effects.css and water-effects.js links plus the data-temo-water layers from feature page HTML. Production stays untouched until deliberate PR merge/deploy.

## Status
Static source checks performed: pass. Real browser rendering, device FPS, Lighthouse, and contact form end-to-end tests: **NOT RUN**. No production deploy.
