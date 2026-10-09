/* ══════════════════════════════════════════════════════════════
   LEARN REGISTRY — the single source of truth for the Learn section.
   Hub page, topic pages, sidebars, breadcrumbs, prev/next buttons and
   cross-links are ALL built from this file.

   Each LEVEL is one HTML file (e.g. basics.html). Each MODULE is a
   <section data-module="…" id="anchor"> inside that file.

   To add a module:
     1. Paste a new <section class="module" id="…" data-module="…"> into the level file.
     2. Add one line to that level's "modules" list below (status 'live').
     That's it. Sidebar, progress ticks, cross-links all update.

   status: 'live' = published, 'soon' = shown greyed out as "coming soon"
   ══════════════════════════════════════════════════════════════ */
window.LEARN_REGISTRY = {
  tracks: [
    {
      id: 'respiratory', title: 'Respiratory', icon: '🫁',
      blurb: 'Blood gases, ventilation and breathing support.',
      topics: [
        {
          id: 'abg', title: 'Blood Gas (ABG)', path: 'respiratory/abg/',
          blurb: 'Read any blood gas in under a minute.',
          levels: {
            basics: {
              title: 'Basics', audience: 'Nurses & MBBS students', time: '~40 min', file: 'basics.html',
              modules: [
                { id: 'abg-b-01', n: 1, title: 'Why blood gas?',           anchor: 'why-blood-gas', status: 'live', mins: 6 },
                { id: 'abg-b-02', n: 2, title: 'Getting a good sample',    anchor: 'good-sample', status: 'live', mins: 7 },
                { id: 'abg-b-03', n: 3, title: 'Reading the printout',     anchor: 'reading-printout', status: 'live', mins: 6 },
                { id: 'abg-b-04', n: 4, title: 'Four steps to any ABG',    anchor: 'four-steps', status: 'live', mins: 8 },
                { id: 'abg-b-05', n: 5, title: 'Oxygen: PO₂ vs SpO₂',      anchor: 'oxygen', status: 'live', mins: 6 },
                { id: 'abg-b-06', n: 6, title: 'Practice: ABG sorter',     anchor: 'practice', status: 'live', mins: 8 }
              ]
            },
            advanced: {
              title: 'Advanced', audience: 'MD & DM residents', time: '~90 min', file: 'advanced.html',
              modules: [
                { id: 'abg-a-01', n: 1, title: 'Henderson–Hasselbalch & buffers', anchor: 'buffers',      status: 'soon' },
                { id: 'abg-a-02', n: 2, title: 'Is compensation appropriate?',    anchor: 'compensation', status: 'soon' },
                { id: 'abg-a-03', n: 3, title: 'Anion gap & its cousins',         anchor: 'anion-gap',    status: 'soon' },
                { id: 'abg-a-04', n: 4, title: 'Base excess: ABE vs SBE',         anchor: 'base-excess',  status: 'soon' },
                { id: 'abg-a-05', n: 5, title: 'Mixed disorders',                 anchor: 'mixed',        status: 'soon' },
                { id: 'abg-a-06', n: 6, title: 'Oxygenation indices',            anchor: 'oxygenation',  status: 'soon' },
                { id: 'abg-a-07', n: 7, title: 'Bicarbonate: when not to',        anchor: 'bicarbonate',  status: 'soon' }
              ]
            }
          }
        },
        {
          id: 'ventilation', title: 'Ventilation', path: 'respiratory/ventilation/',
          blurb: 'From the T-piece to modes and settings.',
          levels: {
            basics: {
              title: 'Basics', audience: 'Nurses & MBBS students', time: '~45 min', file: 'basics.html',
              modules: [
                { id: 'vent-b-01', n: 1, title: 'How we breathe',            anchor: 'how-we-breathe',  status: 'live', mins: 5 },
                { id: 'vent-b-02', n: 2, title: 'Why we ventilate',          anchor: 'why-ventilate',   status: 'live', mins: 5 },
                { id: 'vent-b-03', n: 3, title: 'The T-piece',               anchor: 't-piece',         status: 'live', mins: 6 },
                { id: 'vent-b-04', n: 4, title: 'Speaking ventilator',       anchor: 'terms',           status: 'live', mins: 8 },
                { id: 'vent-b-05', n: 5, title: 'Start, max, end',           anchor: 'trigger-limit-cycle', status: 'live', mins: 6 },
                { id: 'vent-b-06', n: 6, title: 'Common modes',              anchor: 'modes',           status: 'live', mins: 8 },
                { id: 'vent-b-07', n: 7, title: 'Settings by disease',       anchor: 'disease',         status: 'live', mins: 7 }
              ]
            },
            advanced: {
              title: 'Advanced', audience: 'MD & DM residents', time: '~90 min', file: 'advanced.html',
              modules: [
                { id: 'vent-a-01', n: 1, title: 'Volume-targeted ventilation', anchor: 'volume-guarantee', status: 'soon' },
                { id: 'vent-a-02', n: 2, title: 'High-frequency ventilation',  anchor: 'hfov',             status: 'soon' },
                { id: 'vent-a-03', n: 3, title: 'Weaning and extubation',      anchor: 'weaning',          status: 'soon' }
              ]
            }
          }
        },
        {
          id: 'graphics', title: 'Pulmonary Graphics', path: 'respiratory/graphics/',
          blurb: 'Read the ventilator screen like a pro.',
          levels: {
            basics: {
              title: 'Basics', audience: 'Nurses & MBBS students', time: '~40 min', file: 'basics.html',
              modules: [
                { id: 'graph-b-01', n: 1, title: 'Why graphics?',             anchor: 'why-graphics',  status: 'live', mins: 4 },
                { id: 'graph-b-02', n: 2, title: 'Scalars: P, V, flow',       anchor: 'scalars',       status: 'live', mins: 8 },
                { id: 'graph-b-03', n: 3, title: 'Pressure–volume loop',      anchor: 'pv-loop',       status: 'live', mins: 8 },
                { id: 'graph-b-04', n: 4, title: 'Flow–volume loop',          anchor: 'fv-loop',       status: 'live', mins: 5 },
                { id: 'graph-b-05', n: 5, title: 'The five problems',         anchor: 'five-problems', status: 'live', mins: 8 },
                { id: 'graph-b-06', n: 6, title: 'Practice: graphics detective', anchor: 'practice',   status: 'live', mins: 7 }
              ]
            },
            advanced: {
              title: 'Advanced', audience: 'MD & DM residents', time: '~60 min', file: 'advanced.html',
              modules: [
                { id: 'graph-a-01', n: 1, title: 'Asynchrony on the screen', anchor: 'asynchrony', status: 'soon' },
                { id: 'graph-a-02', n: 2, title: 'Optimal PEEP from loops',  anchor: 'optimal-peep', status: 'soon' }
              ]
            }
          }
        }
      ]
    },
    { id: 'sepsis',    title: 'Neonatal Sepsis',          icon: '🧫', blurb: 'Recognition, antibiotics, stewardship.', topics: [] },
    { id: 'fluids',    title: 'Fluids & Electrolytes',    icon: '💧', blurb: 'Day-by-day fluids, sodium, potassium.',   topics: [] },
    { id: 'nutrition', title: 'Nutrition',                icon: '🍼', blurb: 'Feeds, fortifiers and growth.',           topics: [] },
    { id: 'data-ai',   title: 'Data & AI in Neonatology', icon: '🧠', blurb: 'Databases, models and how to read them.',  topics: [] }
  ]
};
