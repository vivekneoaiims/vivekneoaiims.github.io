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
  'mixed':       { term: 'Mixed disorder', def: 'Two problems at once, e.g. CO₂ retention plus lactic acidosis.', see: 'abg-a-05' },

  /* ── Ventilation & pulmonary graphics ── */
  'pip':         { term: 'PIP (peak inspiratory pressure)', def: 'The highest pressure in each machine breath. It decides how big the breath is. Too high stretches and injures the lung.', see: 'vent-b-04#terms-sketch' },
  'peep':        { term: 'PEEP (positive end-expiratory pressure)', def: 'The pressure kept in the lungs between breaths. It stops the alveoli collapsing at the end of each breath.', see: 'vent-b-04#terms-sketch' },
  'ti':          { term: 'Ti (inspiratory time)', def: 'How long each machine breath lasts. Usually 0.3–0.4 s in newborns.', see: 'vent-b-04#terms-sketch' },
  'te':          { term: 'Te (expiratory time)', def: 'Time left for breathing out: 60 ÷ rate − Ti. Too short → air gets trapped.', see: 'vent-b-04#terms-sketch' },
  'tidal-volume':{ term: 'Tidal volume (VT)', def: 'Volume of one breath. In newborns we aim for about 4–6 mL/kg.', see: 'vent-b-04#terms-sim' },
  'minute-ventilation': { term: 'Minute ventilation', def: 'Rate × tidal volume. It mainly controls CO₂: more minute ventilation → lower pCO₂.', see: 'vent-b-04#terms-sim' },
  'map':         { term: 'MAP (mean airway pressure)', def: 'The average pressure over a whole breath cycle. It mainly drives oxygenation.', see: 'vent-b-04#terms-sketch' },
  'compliance':  { term: 'Compliance', def: 'How easily the lung stretches: volume gained per cmH₂O. Low in RDS (stiff lung), better after surfactant.', see: 'graph-b-03#compliance' },
  'resistance':  { term: 'Resistance', def: 'How hard it is to push gas through the airways and tube. High with secretions, a narrow tube, MAS or BPD.', see: 'graph-b-05#detective' },
  'time-constant': { term: 'Time constant (τ = R × C)', def: 'How fast the lung fills and empties. It needs about 3 time constants to empty fully.', see: 'vent-b-07#time-constant' },
  'trigger':     { term: 'Trigger', def: 'What starts a breath: the machine’s timer, or the baby’s own effort (sensed as flow or pressure).', see: 'vent-b-05#tlc' },
  'cycling':     { term: 'Cycling', def: 'What ends a breath: a set time (Ti), or the flow falling to a set percentage of its peak.', see: 'vent-b-05#tlc' },
  'simv':        { term: 'SIMV', def: 'Synchronised intermittent mandatory ventilation: a set number of breaths, timed with the baby’s efforts. Extra efforts get no help.', see: 'vent-b-06#mode-lab' },
  'ac':          { term: 'Assist-control (A/C)', def: 'Every effort the baby makes gets a full machine breath, with a back-up rate if the baby stops breathing.', see: 'vent-b-06#mode-lab' },
  'psv':         { term: 'Pressure support (PSV)', def: 'Every effort is supported, and the breath ends when the baby’s flow falls (flow-cycled), so the baby controls Ti.', see: 'vent-b-06#mode-lab' },
  'cpap':        { term: 'CPAP', def: 'Continuous positive airway pressure: PEEP alone through the nose. The baby does all the breathing.', see: 'vent-b-02#support' },
  'leak':        { term: 'Leak', def: 'Gas that goes in but does not come back to the ventilator, usually around an uncuffed tube. The volume and flow-volume loop do not close.', see: 'graph-b-05#detective' },
  'air-trapping':{ term: 'Air trapping (auto-PEEP)', def: 'The next breath starts before the lung has emptied. Expiratory flow does not return to zero.', see: 'graph-b-05#detective' },
  'beaking':     { term: 'Beaking (over-distension)', def: 'The P-V loop flattens into a beak at the top: more pressure, almost no more volume. PIP is too high.', see: 'graph-b-03#beaking' }
};
