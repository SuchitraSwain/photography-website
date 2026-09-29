# ATELIER × Personal-Site Design System Restyle

**Date:** 2026-09-29  
**Status:** Approved (approach: same design system, photography layouts)

## Source

Brand DNA from [suchitra-swain.web.app](https://suchitra-swain.web.app/) (founder personal site).

## Tokens

| Token | Value |
|---|---|
| Background | `#05070c` |
| Foreground | `#e9eef8` |
| Muted | `#97a3b8` |
| Accent | `#6c9bf2` |
| Grid line | `rgba(148, 176, 224, 0.04)` |
| Glow A | `rgba(15, 76, 129, 0.34)` |
| Glow B | `rgba(78, 146, 214, 0.13)` |
| CTA border | `rgba(148, 176, 224, 0.14)` |
| Display | Inter Tight (800) |
| Body | Inter |
| Mono / nav | IBM Plex Mono |
| Radius | pills for CTA (`999px`); content mostly sharp |

## Atmosphere

Fixed layer stack: `atmos-grid` + soft blue radial glows + light grain (reuse pattern from personal site). Force dark theme only (no light mode for public site).

## Chrome

- Nav: mono uppercase tracked links; brand with small accent mark
- Primary CTA (`Book` / contact): pill outline mono button
- Scroll progress: thin top bar in accent blue
- Replace brass accents with accent blue

## Layout (keep photography)

- Full-bleed hero, gallery masonry/lightbox, founders, services, booking — structure unchanged
- Type scale stays large for photo storytelling; switch serif display → Inter Tight

## Motion

Keep existing Lenis + reveal/stagger system; retune easing to match personal site feel if needed. Respect `prefers-reduced-motion`.

## Out of scope

Admin UI restyle, copying resume section structure, content rewrite.
