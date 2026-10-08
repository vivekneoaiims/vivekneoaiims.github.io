/* ══════════════════════════════════════════════════════════════
   GLOSSARY — any <span class="term" data-term="pco2"> on any page
   becomes a tap-to-open definition with a link to where it's taught.
   'see' = moduleId#section-id (resolved through registry.js).
   ══════════════════════════════════════════════════════════════ */
window.LEARN_GLOSSARY = {
  'ph':          { term: 'pH', def: 'How acidic the blood is. Lower = more acid. Normal 7.35–7.45. A drop of 0.3 means double the acid.', see: 'abg-b-01#seesaw' },
  'acidosis':    { term: 'Acidosis', def: 'Too much acid (pH below 7.35). Either too much CO₂ or too little HCO₃⁻.', see: 'abg-b-01#seesaw' },
  'alkalosis':   { term: 'Alkalosis', def: 'Too little acid (pH above 7.45). Either too little CO₂ or too much HCO₃⁻.', see: 'abg-b-01#seesaw' },
  'pco2':        { term: 'pCO₂', def: 'Carbon dioxide in blood, an acid controlled by the lungs. Normal 35–45 mmHg. Breathe less → it rises.', see: 'abg-b-01#seesaw' },
  'hco3':        { term: 'HCO₃⁻ (bicarbonate)', def: 'The main base in blood, controlled by the kidneys. Normal 20–24 mEq/L in neonates. Calculated by the machine, not measured.', see: 'abg-b-03#printout' },
  'be':          { term: 'Base excess (BE)', def: 'How much base is extra (+) or missing (−). Normal −4 to +2. Below −4 = metabolic acidosis; beyond ±10 is clinically significant.', see: 'abg-b-03#printout' },
  'compensation':{ term: 'Compensation', def: 'The other organ trying to pull pH back to normal. Lungs act in minutes, kidneys take days.', see: 'abg-b-04#steps' },
  'respiratory': { term: 'Respiratory disorder', def: 'The problem starts with CO₂, i.e. with breathing.', see: 'abg-b-04#steps' },
  'metabolic':   { term: 'Metabolic disorder', def: 'The problem starts with HCO₃⁻: acid made by the body or base lost or gained.', see: 'abg-b-04#steps' },
  'po2':         { term: 'PO₂', def: 'Oxygen dissolved in plasma. Neonatal target usually 50–70 mmHg.', see: 'abg-b-05#curve' },
  'spo2':        { term: 'SpO₂', def: 'Percent of haemoglobin carrying oxygen, measured by the pulse oximeter.', see: 'abg-b-05#curve' },
  'hbf':         { term: 'Fetal haemoglobin (HbF)', def: 'Grips oxygen tightly, so a baby shows high SpO₂ even at modest PO₂.', see: 'abg-b-05#curve' },
  'fio2':        { term: 'FiO₂', def: 'Fraction of oxygen breathed in. Room air = 0.21. Enter it into the machine with every sample.', see: 'abg-b-03#printout' },
  'capillary':   { term: 'Capillary sample', def: 'Heel-prick from a warmed heel. Fine for pH and pCO₂, unreliable for PO₂.', see: 'abg-b-02#sites' },
  'air-bubble':  { term: 'Air bubble error', def: 'Room air in the syringe pushes PO₂ toward ~150 and drags pCO₂ down.', see: 'abg-b-02#errors' },
  'hypercapnia': { term: 'Hypercapnia', def: 'pCO₂ above 50 mmHg in neonates.', see: 'abg-b-03#normals' },
  'hypoxia':     { term: 'Hypoxia', def: 'PO₂ below 50 mmHg.', see: 'abg-b-05#curve' },
  'hyperoxia':   { term: 'Hyperoxia', def: 'PO₂ above 70 mmHg. Harmful to the eyes, lungs and brain of preterm babies.', see: 'abg-b-05#curve' },
  'anion-gap':   { term: 'Anion gap', def: 'Finds the hidden acid in metabolic acidosis: Na⁺ − (Cl⁻ + HCO₃⁻).', see: 'abg-a-03' },
  'mixed':       { term: 'Mixed disorder', def: 'Two problems at once, e.g. CO₂ retention plus lactic acidosis.', see: 'abg-a-05' }
};
