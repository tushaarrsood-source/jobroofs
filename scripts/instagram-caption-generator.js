/**
 * Generates viral, high-converting German captions for Instagram feed & stories.
 */
function generateJobCaption({
  title = 'Barista & Café Allrounder (m/w/d)',
  company = 'Café Silo Berlin',
  city = 'Berlin',
  district = 'Friedrichshain',
  wage = '16,00 € / Std.',
  employmentType = 'Minijob (bis 603 €)',
  jobSlug = 'cafe-silo-barista',
}) {
  const cityTag = city.toLowerCase().replace(/[^a-z]/g, '');

  return `☕ Neuer Job in ${city}! Verstärkung gesucht bei ${company} in ${district}.

📍 ${district}, ${city}
💶 ${wage} (${employmentType})
⚡ 1-Klick-Bewerbung ohne langes Anschreiben

Du liebst guten Kaffee und suchst eine flexible Stelle mit fairem Team und planbaren Schichten? 

👉 Jetzt direkt bewerben über den Link in unserer Bio oder auf jobroofs.com/jobs/${jobSlug}

Du führst selbst ein Café, einen Kiez-Laden oder ein Restaurant?
Inseriere dein erstes Jobangebot 100% kostenlos auf jobroofs.com (ohne Abo-Falle!).

.
.
#minijob${cityTag} #jobsuche${cityTag} #studentenjob${cityTag} #nebenjob #teilzeit #${cityTag}jobs #gastrojobs #barista #kiezliebe #jobroofs #arbeitsmarkt2026`;
}

module.exports = { generateJobCaption };
