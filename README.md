# MVI Appliance Services — website

Static site for **MVI Appliance Services**, a family-owned appliance repair
business serving Fresno, Clovis, and Madera, CA (mviappliance.com). No build
step, no framework, no npm dependencies — plain HTML/CSS/JS deployed as-is.

## Project structure

```
/
├── index.html                  Home page
├── about/index.html            About / owner bio
├── maintenance/index.html      "Clean & Maintain" services page
├── contact/index.html          Contact form + map
├── blog/index.html             Blog listing page
├── service-locations/
│   ├── index.html               Service-area overview
│   ├── fresno/index.html
│   ├── clovis/index.html
│   └── madera/index.html
├── <slug>/index.html           One folder per blog post (SEO-friendly URLs)
├── css/style.css               Single stylesheet (custom properties for
│                                 brand colors/fonts, flexbox/grid, no framework)
├── js/main.js                  Mobile nav toggle, scroll-reveal animation,
│                                 and the contact-form submit handler
├── images/                     Photos, logo, blog cover images
├── netlify.toml                Netlify build + cache-header config
├── robots.txt
└── sitemap.xml
```

Every page is a self-contained static HTML file — there's no templating
engine, so the header/footer markup is duplicated across pages. When you
change the nav, footer, phone number, etc., you're doing a find-and-replace
across all `index.html` files (see below).

## Updating content

### Business info (phone, email, address, hours)

These appear in three places on every page — update all three, everywhere
they occur:
1. The visible header/footer/contact-page markup.
2. The `application/ld+json` schema block in `<head>` (used by Google for
   rich results — keep it in sync with the visible content).
3. `contact/index.html`'s Google Maps embed URL, if the address changes.

Because the header/footer are identical on every page, a project-wide
find-and-replace (e.g. `grep -rl "5599057810" --include="*.html" .`) is the
fastest way to update a phone number or similar detail across the whole site.

### Hours

Hours currently read "Mon–Sun, Open 24 Hours" in the footer, contact page,
and the JSON-LD `openingHoursSpecification`. Update all of these together if
hours change.

### Services / prices

Service cards live directly in the HTML of `index.html` (home page services
grid) and `maintenance/index.html`. Duda's export didn't include itemized
pricing, so none is published on the site — if you want to list prices,
add them into these existing `.service-card` / `.info-card` blocks.

### Blog posts

Each post is its own folder (`<slug>/index.html`). To add a new one:
1. Copy an existing post folder as a starting template (keeps the header,
   footer, and JSON-LD structure consistent).
2. Update the `<title>`, meta description, `og:*` tags, canonical URL, and
   body content.
3. Add a card for it to `blog/index.html`'s `.blog-grid` (copy one of the
   existing `<a class="blog-card">` blocks) and, optionally, to the "From
   the Blog" grid on the home page.
4. Add a `<url>` entry to `sitemap.xml`.

`images/` has a handful of cover photos (`cover-*.jpg`) that aren't
currently referenced by any page — they look like spares for blog posts
that were planned but not written; reuse them for new posts if the subject
matches, or ignore them.

### Images / logo

Drop new images into `images/` and reference them as `/images/filename.jpg`.
`img { max-width: 100%; }` is already set globally, so images scale
responsively without extra markup.

**Missing:** there's no square favicon/app icon in the export (`images/logo.png`
is a wide wordmark, 495×112, not square). No `<link rel="icon">` was added — if
you have a square logo mark (SVG preferred), send it and it can be wired up.

## Contact form (Netlify Forms)

The form in `contact/index.html` uses [Netlify Forms](https://docs.netlify.com/forms/setup/):
`data-netlify="true"` + a hidden `form-name` input is what makes Netlify
detect and provision it at deploy time. `js/main.js` intercepts the submit
event with `fetch()` and shows an inline "Thanks!" / error message in place,
instead of letting the browser POST natively (which would redirect visitors
to Netlify's generic `/` success page). Don't remove `data-netlify="true"`
or the hidden `form-name` field — Netlify's form-detection crawler needs to
see the static markup at deploy time, not just runtime JS.

## Local preview

No build step — just serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/. (Netlify Forms won't actually submit
anywhere useful from local preview — that only works once deployed.)

## Deploying to Netlify

You'll need to do this part yourself — this environment doesn't have Netlify
credentials.

### Option A: Git-connected (recommended — auto-deploys on every push)

1. In the [Netlify dashboard](https://app.netlify.com), click **Add new site
   → Import an existing project**.
2. Connect GitHub and select this repository.
3. Build settings: leave **Build command** empty and set **Publish directory**
   to `.` (both are also set in `netlify.toml`, so Netlify should pick them
   up automatically — just confirm they match before deploying).
4. Deploy. Every future push to the connected branch redeploys automatically.

### Option B: Drag-and-drop (manual, one-off)

1. Zip (or just select) the contents of this repo folder.
2. In the Netlify dashboard, go to **Sites** and drag the folder/zip onto the
   "Drag and drop your site output folder here" area.
3. Repeat manually any time you want to push an update — no auto-deploy.

### Once it's live, double-check:

- Visit the live URL and click through the nav, including on a phone-sized
  screen (hamburger menu).
- Submit the contact form for real and confirm you stay on the same page
  with the inline "Thanks!" message — not a redirect to a generic Netlify
  success page.
- In the Netlify dashboard, go to **Site configuration → Forms** (or **Forms**
  in the left nav) and confirm the "service-request" form is listed and the
  test submission shows up. If it's empty:
  - Check that the deployed **Publish directory** actually matches where
    `contact/index.html` lives (should be the repo root, `.`).
  - Some Netlify project types require **Forms detection** to be explicitly
    enabled under **Project configuration → Forms** — check that toggle.
- Check the Google Map on the Contact page loads and points to the right
  pin.

## A judgment call worth knowing about

The visible page copy (footer, contact sidebar, homepage "Get In Touch"
section) intentionally only ever says "Fresno, Clovis & Madera Area" — it
never prints the street address in prose. The exact street address
(7691 N Erie Ave, Fresno, CA 93722) only appeared in the hidden
`application/ld+json` schema block, which is invisible to visitors but is
what Google Business Profile matches against for local search.

The Google Maps embed added to the Contact page pins that exact address.
That address was already technically public (visible in page source /
to Google), so this doesn't newly expose anything — but if this is a
service-area business without a public storefront and you'd rather the map
just show the general Fresno/Clovis/Madera area instead of a precise pin,
say so and it's a one-line change in `contact/index.html`.
