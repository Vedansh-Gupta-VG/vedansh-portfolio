# Vedansh Gupta - Portfolio

**[vedanshgupta.me](https://vedanshgupta.me)** - my personal developer portfolio: about, skills, experience, projects, achievements, education, and contact, all in one page.

![Live](https://img.shields.io/badge/status-live-brightgreen)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![No framework](https://img.shields.io/badge/framework-none-lightgrey)

A single-page developer portfolio. Plain HTML/CSS/JS, no framework, built
as one file per section so any one feature can be found and edited without
touching the rest.

## Highlights

- Animated starfield hero with a typewriter effect, built on `<canvas>`
- Modular CSS/JS: one file per section, concatenated and minified only at build time
- Certificate/document viewer modal with PDF download fallback
- Terminal-style contact form (EmailJS-powered, with spam protection)
- Production build cuts 31 network requests down to 2 (see [Build & deploy](#build--deploy))
- Locked-down Content-Security-Policy, no wildcard script/style sources
- SEO-ready: Open Graph tags, JSON-LD `Person` schema, sitemap, robots.txt

## Tech stack

Plain **HTML5**, **CSS3**, and **vanilla JavaScript**, no frameworks, no
build-time dependencies beyond bundling/minifying for production. Contact
form powered by [EmailJS](https://www.emailjs.com/).

## Connect

- LinkedIn: [linkedin.com/in/vedansh-gupta-ba298528a](https://www.linkedin.com/in/vedansh-gupta-ba298528a)
- GitHub: [github.com/Vedansh-Gupta-VG](https://github.com/Vedansh-Gupta-VG)
- Email: [vedanshgupta.off@gmail.com](mailto:vedanshgupta.off@gmail.com)

## Structure

```
index.html              All sections live in one file (single page, nav
                         scrolls to #anchors). Wrapped in <main> for
                         accessibility. Has a Content-Security-Policy
                         meta tag, see "Adding a new external resource"
                         below before adding any new third-party script/font.

css/
  variables.css          Design tokens (colors, type, spacing), edit
                          once here, it applies everywhere.
  base.css                Reset + shared card/button/heading styles.
  atmosphere.css           Starfield background canvas styling.
  nav.css, hero.css,       One file per page section. Matches the
  about.css, skills.css,   section IDs in index.html 1:1, e.g.
  experience.css,          everything for #contact lives in contact.css.
  projects.css,
  achievements.css,
  education.css,
  contact.css, end.css
  modal.css                Shared styling for all modal popups
                            (About Me, project details, certificates,
                            patents, research paper).
  doc-viewer.css            The certificate/document viewer modal.
  terminal.css               The terminal-style contact form widget.

js/
  atmosphere.js            Starfield background animation (canvas).
                            Capped star count, pauses when the tab
                            isn't visible, respects prefers-reduced-motion.
  nav.js                     Scroll-shrink nav pill + mobile menu.
  hero.js                    Typewriter effect on the hero subtitle.
  interactions.js            Small shared UI interaction helpers.
  selection.js                Escape-key / click-outside handling shared
                               across popups.
  modal.js                    Generic open/close logic for the shared
                               modal system (About Me, etc).
  certificates.js              Certificate/document viewer modal +
                                download button logic (fetches the PDF
                                if one exists, falls back to the image).
  experience.js                 Scroll-reveal animation for the
                                 experience timeline cards.
  projects-data.js               Project content (the actual project
                                  entries, edit here to add/change a
                                  project, not in index.html).
  projects.js                     Renders project cards from
                                   projects-data.js, project detail modal,
                                   "View All Projects" explorer.
  achievements.js                  Patents/certifications explorer modals.
  education.js                      Education timeline.
  contact.js                         Contact form: validation, EmailJS
                                      send, honeypot + cooldown spam
                                      protection, terminal-style animated
                                      status output.
  end.js                             Footer "return to orbit" scroll-to-top.

assets/images/            Site's own images (logo, decorative
                           illustrations, project thumbnails, logos).
                           WebP versions of the larger decorative
                           illustrations sit alongside their .png
                           originals, index.html uses <picture> to
                           serve WebP with the PNG as fallback.

content-to-add/           Real uploaded documents, referenced directly
                           by path in index.html:
  resume/                   Resume PDF, linked from the Contact section.
  certificates/              Internship/leadership certificates (PNG + PDF).
  certifications/              Certification images.
  projects/                     Any project-specific documents.
  research/                      Research paper PDF.

build.js, package.json    Production build, see "Build & deploy" below.
```

## Build & deploy

The site ships 16 CSS files and 15 JS files as *source* (that's what
keeps each feature easy to find and edit) but real visitors shouldn't
have to make 31 separate network requests to load the page. Before
deploying, bundle everything into two files:

```
npm install       # one-time
npm run build      # produces a ready-to-deploy dist/ folder
```

`dist/` contains `index.html`, `main.min.css`, `main.min.js`, plus a
copy of `assets/` and `content-to-add/`. **Deploy the contents of
`dist/`, not the project root.** `dist/` is regenerated fresh every
time you run the build, never edit anything inside it directly, your
changes will be overwritten on the next build.

## SEO

`index.html` ships with:
- A unique `<title>` and `<meta name="description">`
- Open Graph and Twitter card tags (for link previews on LinkedIn, WhatsApp, etc.)
- A `<link rel="canonical">` pointing at `https://vedanshgupta.me/`
- A JSON-LD `Person` schema (helps Google associate this page with your name specifically)

`robots.txt` and `sitemap.xml` live at the project root and are copied into
`dist/` by the build step. Both must be served from the site root
(`vedanshgupta.me/robots.txt`, not nested in a folder) for search engines to
find them.

**If you edit the JSON-LD block's content**, you must regenerate the CSP hash
that whitelists it, or the browser will silently block it:

```bash
python3 -c "
import re, hashlib, base64
html = open('index.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.S)
h = hashlib.sha256(m.group(1).encode()).digest()
print('sha256-' + base64.b64encode(h).decode())
"
```
Then swap the new hash into the `script-src` directive of the CSP meta tag.

After deploying, submit the site to [Google Search Console](https://search.google.com/search-console) and request indexing to speed up how quickly it appears in search results.

## Adding a new external resource

If you add a script, font, or API call to a new third-party domain,
you must also add that domain to the Content-Security-Policy meta tag
in the `<head>` of `index.html`, otherwise the browser will silently
block it. The CSP currently allows: Google Fonts, the EmailJS CDN and
API, and the simpleicons/jsdelivr icon CDNs used for skill badges.

## Local preview (without building)

```
python3 -m http.server 8000
```
then visit `http://localhost:8000`, this serves the unbundled source
directly, useful while actively editing. Use the `dist/` build
(above) to preview what a real visitor will actually get.
