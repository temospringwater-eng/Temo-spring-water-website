# TEMO Water Effects — Release Gate (8 October 2026)

Branch: feature/temo-water-effects-phase1-2
PR: https://github.com/temospringwater-eng/Temo-spring-water-website/pull/2
**Do not merge or deploy without explicit approval.**

## Automated verification (commit eb88937a)
- [x] Water Effects Source QA: success
- [x] Water Effects Browser QA: success
- [x] Water Animation Motion QA: success
- [x] TEMO Contact Form Safe QA: success (FormSubmit request intercepted, no email delivered)
- [x] TEMO Water Lighthouse QA: success (lab only)
- [x] Water Effects Paired Performance: success (lab only)

## Outstanding manual release gates
- [ ] Review real preview URL; do not assume one exists from PR.
- [ ] Verify animated experience on a real Android phone, including navigation, CTA taps, contrast and smoothness.
- [ ] Check real FormSubmit delivery to existing Gmail using a clearly marked authorized test submission. **Do not do so in automated QA.**
- [ ] Review latest Lighthouse numerical data, lab-run variability, and accessibility exceptions; compare baseline using repeatable conditions.
- [ ] Confirm Cloudflare branch preview configuration and ensure previews cannot publish to production.
- [ ] Obtain user approval before converting PR from draft, merging, or production deployment.

## Rollback
If later approved and deployed, revert the water effects PR or remove water-effects CSS/JS links plus decorative markup. Do not revert unrelated site changes.
