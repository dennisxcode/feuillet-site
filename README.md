# feuillet.site

The marketing page for [Feuillet](https://feuillet-theta.vercel.app), an all in
one student app. One page: what it is, what it does, and where to get it.

Deliberately three static files and no build step. A landing page that needs
`npm install` to change a sentence is a landing page nobody changes.

```
index.html    the page
styles.css    the theme, lifted token for token from the app's src/index.css
site.js       theme toggle, scroll reveals, the notch panel, the checkboxes
assets/       Feuillet Sans, the favicon, the social card
```

Open `index.html` in a browser, or `python3 -m http.server` from this
directory if you want the font served over http rather than from a file URL.

## Rules this page inherits from the app

These come from the product's own THEME.md and CLAUDE.md, and the site is only
worth anything if it does not drift from them.

- **One face.** Feuillet Sans sets every word. Hierarchy is scale, colour and
  spacing, never a change of voice, and never a bold weight the font does not
  have.
- **The leaf is `ss01`, display type only.** Set in running text it stops being
  a mark and becomes noise. `.display` is the class that spends it.
- **Colour is meaning-bearing.** `accent` means done or growing, `amber` means
  wants attention, `danger` means slipping, `info` is school, `violet` is other
  lanes. Nothing on this page is coloured because it looked nice.
- **Two themes, three states.** Parchment and Nocturne, plus following the
  system, which is why the light palette is declared under both a media query
  and an attribute. Nocturne is the default here; the app defaults to auto.
- **No em dashes in copy.** Commas and full stops.
- **Nothing is claimed that does not work.** Grades, Classroom and the tree
  carry a badge saying so. See below.

## Motion

The numbers are the app's, not new ones.

- **The notch panel opens staged**, width first and height 100ms behind. That
  offset is what reads as a hinge; at 200ms it reads as two separate events.
- **It closes with a genie**, 260ms, gathering and then accelerating, warping
  its own pixels rather than cropping its outline.
- **Inverted corners, 13px**, where the panel meets the top edge.
- **Springs are damped at zeta 0.85.** `--spring` is that equation sampled into
  a `linear()`, and it overshoots 0.6%. The bouncier 0.7 curve threw 4.6% and
  was rejected in the app for exactly that.
- Everything is off under `prefers-reduced-motion`.

## What the page claims, and what it does not

The site shows the whole product including what is not finished, with anything
unshipped badged. Keeping that accurate is the maintenance job here.

| Section | Badge | Why |
|---|---|---|
| Board, calendar, week grid | none | shipped |
| Notch panel, mirror, timer, jot | none | shipped in 1.5 and later |
| Reminders | none | shipped, with the "not while quit" limit stated on the page |
| Agenda photo | none | shipped, though no real photograph has been through the parser yet |
| Todoist | Connected | connected against a live account 2026-08-23 |
| Google Calendar | Connected | connected against a live account 2026-08-23 |
| Google Classroom | Needs your school | built and correct, blocked by Brébeuf's Workspace administrator |
| Grades and the school portal | Soon | built, cannot run until a term is publishing marks |
| The tree | Soon | one leaf per finished task exists, the tree does not |

## Preview

`node scripts/build-preview.mjs` folds all three files plus the woff2 into one
self-contained `preview.html`, for opening from a Downloads folder or handing
to something that only takes one document. `--fragment` writes a body-only
version for hosts that supply their own skeleton. Both are gitignored: the
three source files are the site.

## The font

`assets/feuillet-sans.woff2` is copied from the app, and it is the **built**
file, not the delivered one. The delivered `Feuillet-Sans.ttf` ships 94 glyphs,
no kerning, and a few widths that were never finished, which matters here
because half the words on this page are French. Rebuild it in the app repo with
`tools/build-feuillet-sans.py` and copy the result across; do not point this at
the source TTF.
