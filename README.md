# Mikomi Institute of Japanese Language — Landing Page

A premium, conversion-focused landing page for **Mikomi Institute of Japanese Language**. Every CTA is engineered to start a **WhatsApp conversation**. Built with plain HTML, CSS and vanilla JavaScript — zero build step, zero dependencies, deployable directly to **GitHub Pages**.

---

## ✨ Features

- **Premium animated loader** — Japanese red circle, fades into the page
- **Sticky glassmorphism header** with smooth-scroll navigation
- **Hero** with inline SVG scene (Mt. Fuji, Torii gate, cherry blossoms), floating cherry-blossom petals and animated counters
- **Trust strip, Why Learn Japanese, About + Founder, Why Mikomi, Courses, JLPT Roadmap, Learning Process, Careers, Testimonials carousel, FAQ accordion, Contact, Footer**
- **Conversion features:** floating pulsing WhatsApp button, sticky mobile bottom bar, exit-intent + 20s timed popup, scroll progress bar, back-to-top, reveal-on-scroll, hover/card-lift animations
- **SEO:** title, meta description, canonical, robots, Open Graph, Twitter cards, Schema.org (EducationalOrganization + FAQPage), sitemap.xml, manifest.json, favicon
- **Accessible:** ARIA labels, keyboard navigation, alt/aria text, semantic headings, `prefers-reduced-motion` support
- **Responsive** across mobile / tablet / desktop

---

## 📁 Project Structure

```
mikomi-website/
├── index.html          # Full markup
├── style.css           # All styling + responsive + tokens
├── script.js           # Loader, nav, reveal, counters, petals, carousel, popups
├── manifest.json       # PWA manifest
├── robots.txt
├── sitemap.xml
├── README.md
├── favicon/
│   └── favicon.svg
├── assets/
│   └── og-image.svg    # Open Graph / Twitter share image
└── images/             # Drop optional raster images here
```

## 📱 WhatsApp — Single Source of Truth

All CTAs use the class `wa-link`. On load, `script.js` sets every `.wa-link` to the pre-filled WhatsApp URL for **+91 8178795615**. To change the number or message, edit `WHATSAPP_URL` at the top of [`script.js`](script.js).

## 🚀 Deploy to GitHub Pages

1. Create a repo and push these files to the root.
2. **Settings → Pages → Source:** `Deploy from a branch` → `main` → `/ (root)`.
3. Visit `https://<username>.github.io/<repo>/`.

> Update the placeholder domain `https://mikomiinstitute.online/` in `index.html` (canonical, OG, Schema), `robots.txt` and `sitemap.xml` once your real domain is live.

## 🔧 Customisation Quick Reference

| What | Where |
|------|-------|
| WhatsApp number / message | `WHATSAPP_URL` in `script.js` |
| Colors / spacing / radius | `:root` tokens in `style.css` |
| Course prices | `#courses` section in `index.html` |
| Contact details & socials | `#contact` + footer in `index.html` |
| Google Maps embed | replace `.map-placeholder` in `#contact` |

## ⚡ Performance

No frameworks, no external JS libraries, fonts preconnected, SVG artwork (crisp + tiny), IntersectionObserver-based animations, `passive` scroll listeners — built to score **95+** on Lighthouse.

---

© Mikomi Institute of Japanese Language. Online Japanese classes across India.
