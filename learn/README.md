# Learn section: how it works

Upload the whole `learn/` folder to the root of your site, so it lives at
`https://vivekneoaiims.com/learn/`.

## Folder map

```
learn/
├── index.html                  Hub: lists all tracks (built from registry.js)
├── glossary.html               All terms (built from glossary.js)
├── assets/
│   ├── registry.js             ★ The ONE list of tracks, topics, levels, modules
│   ├── glossary.js             ★ Term definitions + where each is taught
│   ├── learn.js                Engine: menus, links, quizzes, progress, analytics
│   └── learn.css               Shared look (matches your main site)
└── respiratory/
    └── abg/
        ├── index.html          Topic page: Basics / Advanced doors
        ├── basics.html         ★ ALL Basics modules in one file
        └── advanced.html       (to be built, same pattern)
```

## Inside basics.html
Each module is one clearly marked block:

```html
<!-- ══════════ MODULE 3 ══════════ -->
<section class="module" id="reading-printout" data-module="abg-b-03">
  … hook → sketch → simulator → quiz → pocket card …
</section>
```
The simulator code for each module sits at the bottom of the file, under the
same `MODULE 3` heading. Edit text freely; it won't affect other modules.

## Add a module
1. Paste a new `<section class="module" id="…" data-module="…">` block into the level file.
2. Add one line for it in `assets/registry.js` (with its `anchor` = the section id, status `'live'`).
The sidebar, progress ticks, topic page and cross-links update themselves.

## Add a topic (e.g. Ventilation)
Copy `respiratory/abg/` to `respiratory/ventilation/`, list its modules in
registry.js, and set `data-topic="ventilation"` in its pages.

## Link between modules (even across files)
- `<a data-to="abg-b-02#errors">sampling errors</a>` → jumps to that spot.
  Uses ids, not file paths. Links to unfinished modules show greyed out.
- `<span class="term" data-term="pco2">pCO₂</span>` → tap-to-define, with a link to where it's taught.

## Link from your main page
In your main `index.html`, inside `TEACHING_DATA`:

```js
basics: [
  { title: "Blood Gas (ABG): Basics — 6 interactive modules", url: "learn/respiratory/abg/basics.html", tag: "article", meta: "Dr. Vivek Kumar · 2026 · Nurses & MBBS" },
],
advanced: [
  { title: "Blood Gas (ABG): Advanced", url: null, tag: "soon", meta: "Coming soon · MD & DM residents" },
],
```

## Source rule
Where the workbook and the slides differ, the **Neonatal Ventilation Workbook 2026** wins:
- Normal values: pH 7.35–7.45, pCO₂ 35–45, PO₂ 50–70, HCO₃⁻ 20–24, BE −4 to +2.
- Interpretation follows the workbook's order: pH → pCO₂/HCO₃⁻/BE → compensation → simple or mixed → cause.
- Compensation wording: pH normal = well compensated; near normal = partial; far off = uncompensated.
- Sample delay drift uses the workbook's in-vitro table (37 °C vs 4 °C).
- The slides' 7.40 split is used only as a tiebreaker when pH is within 7.35–7.45.
