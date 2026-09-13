const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const PALETTES = {
  forest: { bg: '#385542', text: '#F6F4EB', name: 'Forest Green & Cream' },
  navy: { bg: '#1E293B', text: '#F8FAFC', name: 'Midnight Navy & Crisp White' },
  terracotta: { bg: '#7C2D12', text: '#FEF3C7', name: 'Earthy Rust & Amber Cream' },
  clay: { bg: '#4A3728', text: '#F7F4EE', name: 'Roasted Mocha & Warm Milk' },
  obsidian: { bg: '#09090B', text: '#FAFAF9', name: 'Charcoal Black & Paper' },
  sage: { bg: '#445447', text: '#F5F5ED', name: 'Muted Sage & Pale Ivory' },
  slate: { bg: '#334155', text: '#F1F5F9', name: 'Industrial Slate & Alabaster' },
  plum: { bg: '#3B1D2C', text: '#FDF2F8', name: 'Deep Mulberry & Blush' },
};

const paletteKeys = Object.keys(PALETTES);

// 1. 30 Employer Hooks
const EMPLOYER_ROLES = [
  { r1: 'NEED A', r2: 'HELPER?', sub: 'MINIJOB & ALLROUNDER', tags: '0 € ERSTINSERAT   |   1-KLICK WHATSAPP   |   KEIN ABO', roleDE: 'Aushilfe' },
  { r1: 'NEED A', r2: 'BARISTA?', sub: 'CAFÉ, BAR & SERVICE', tags: 'DIREKTKONTAKT   |   OHNE AGENTUR   |   1. INSERAT GRATIS', roleDE: 'Barista' },
  { r1: 'NEED A', r2: 'DRIVER?', sub: 'KURIER, LOGISTIK & SHUTTLE', tags: 'SCHNELLE BESETZUNG   |   0% ZEITARBEIT   |   KIEZ-FILTER', roleDE: 'Fahrer' },
  { r1: 'NEED A', r2: 'COOK?', sub: 'KÜCHE, BISTRO & GASTRO', tags: 'SOFORT-KONTAKT   |   1. INSERAT GRATIS   |   2 MIN ONLINE', roleDE: 'Koch' },
  { r1: 'NEED A', r2: 'CASHIER?', sub: 'RETAIL, STORE & BOUTIQUE', tags: 'KIEZ-REICHWEITE   |   WHATSAPP BEWERBUNG   |   0 € START', roleDE: 'Kassierer' },
  { r1: 'NEED A', r2: 'CLEANER?', sub: 'GEBÄUDE & UNTERHALT', tags: 'ZUVERLÄSSIG   |   100% DIREKT   |   KEINE ZWISCHENHÄNDLER', roleDE: 'Reinigungskraft' },
  { r1: 'NEED A', r2: 'WAITER?', sub: 'SERVICE, RESTAURANT & BAR', tags: 'SCHICHTEN BESETZEN   |   OHNE CV-WAHNSINN   |   0 € ANZEIGE', roleDE: 'Kellner' },
  { r1: 'NEED A', r2: 'DISHWASHER?', sub: 'SPÜLKRAFT & KÜCHENHILFE', tags: 'SOFORT VERFÜGBAR   |   1-KLICK KONTAKT   |   0 € INSERAT', roleDE: 'Spülkraft' },
  { r1: 'NEED A', r2: 'PAINTER?', sub: 'MALER & LACKIERER', tags: 'HANDWERKER GESUCHT   |   KIEZ-BETRIEBE   |   KEIN ABO', roleDE: 'Maler' },
  { r1: 'NEED AN', r2: 'ELECTRICIAN?', sub: 'ELEKTRO & MONTAGEN', tags: 'FACHKRÄFTE FINDEN   |   DIREKTER DRAHT   |   0 € START', roleDE: 'Elektriker' },
  { r1: 'NEED A', r2: 'CARPENTER?', sub: 'TISCHLER & SCHREINER', tags: 'ECHTES HANDWERK   |   0% VERMITTLER   |   SCHNELL LIVE', roleDE: 'Tischler' },
  { r1: 'NEED A', r2: 'RECEPTIONIST?', sub: 'EMPFANG & PRAXIS', tags: 'FREUNDLICH & ZUVERLÄSSIG   |   WHATSAPP   |   1. POST GRATIS', roleDE: 'Empfangskraft' },
  { r1: 'NEED A', r2: 'PACKER?', sub: 'LAGER & VERSAND', tags: 'FLEXIBLE AUSHILFEN   |   0% AGENTURGEBÜHR   |   JOBROOFS', roleDE: 'Kommissionierer' },
  { r1: 'NEED A', r2: 'SECURITY?', sub: 'EVENT & OBJEKTSCHUTZ', tags: 'SICHERHEITSDIENST   |   SCHNELLE ANTWORT   |   0 € START', roleDE: 'Sicherheitskraft' },
  { r1: 'NEED A', r2: 'GARDENER?', sub: 'GARTEN & LANDSCHAFT', tags: 'GRÜNE DAUMEN   |   LOKALE KRÄFTE   |   KEIN PAPIERKRIEG', roleDE: 'Gärtner' },
  { r1: 'NEED A', r2: 'STAGEHAND?', sub: 'EVENT, MESSE & BÜHNE', tags: 'ANPACKER GESUCHT   |   FLEXIBLE SHIFTS   |   100% DIREKT', roleDE: 'Stagehand' },
  { r1: 'NEED A', r2: 'DOG WALKER?', sub: 'TIERBETREUUNG & SERVICE', tags: 'TIERLIEBE TALENTE   |   IM KIEZ   |   0 € INSERAT', roleDE: 'Dog Walker' },
  { r1: 'NEED A', r2: 'DELIVERY RIDER?', sub: 'E-BIKE & CITY COURIER', tags: 'SCHNELLE LIEFERUNG   |   WHATSAPP   |   KEIN ATS-TOOL', roleDE: 'Kurierfahrer' },
  { r1: 'NEED A', r2: 'BARBACK?', sub: 'CLUB & BAR SUPPORT', tags: 'NACHT-SHIFTS   |   TEAMPLAYER   |   1. JOB GRATIS', roleDE: 'Barback' },
  { r1: 'NEED A', r2: 'HOSTESS?', sub: 'MESSE, EVENT & PROMO', tags: 'CHARISMATISCH   |   SCHNELLER DRAHT   |   0 € ANZEIGE', roleDE: 'Hostess' },
  { r1: 'NEED A', r2: 'PROMOTOR?', sub: 'STREET & EVENT MARKETING', tags: 'ENGAGIERTE TEAMS   |   1-KLICK BEWERBUNG   |   JOBROOFS', roleDE: 'Promoter' },
  { r1: 'NEED A', r2: 'TUTOR?', sub: 'NACHHILFE & TRAINING', tags: 'WISSEN WEITERGEBEN   |   FLEXIBEL   |   0 € INSERAT', roleDE: 'Nachhilfelehrer' },
  { r1: 'NEED A', r2: 'BABYSITTER?', sub: 'FAMILIEN & BETREUUNG', tags: 'VERTRAUENSVOLL   |   AUS DEINER NÄHE   |   KEIN ABO', roleDE: 'Babysitter' },
  { r1: 'NEED A', r2: 'BIKE MECHANIC?', sub: 'FAHRRADWERKSTATT', tags: 'SCHRAUBER GESUCHT   |   KIEZ-LADEN   |   100% DIREKT', roleDE: 'Zweiradmechaniker' },
  { r1: 'NEED A', r2: 'MOVER?', sub: 'UMZUGSHELFEN & TRANSPORT', tags: 'STARKE HÄNDE   |   SCHNELLE BESETZUNG   |   0 € START', roleDE: 'Umzugshelfer' },
  { r1: 'NEED A', r2: 'SALES CLERK?', sub: 'VERKAUF & BERATUNG', tags: 'LADENINHABER   |   WHATSAPP KONTAKT   |   0% ZEITARBEIT', roleDE: 'Verkäufer' },
  { r1: 'NEED A', r2: 'FITTER?', sub: 'MONTAGE & SERVICE', tags: 'UNTERWEGS IM KIEZ   |   DIREKTER DRAHT   |   JOBROOFS', roleDE: 'Monteur' },
  { r1: 'NEED A', r2: 'HAIRSTYLIST?', sub: 'SALON & BARBERSHOP', tags: 'KREATIVE TALENTE   |   OHNE AGENTUR   |   1. INSERAT 0 €', roleDE: 'Friseur' },
  { r1: 'NEED A', r2: 'TATTOO ARTIST?', sub: 'STUDIO & GUEST SPOT', tags: 'PORTFOLIO DIRECT   |   KEIN ATS   |   JOBROOFS.COM', roleDE: 'Tätowierer' },
  { r1: 'NEED A', r2: 'FITNESS COACH?', sub: 'STUDIO & KURSE', tags: 'TRAINER GESUCHT   |   1-KLICK WHATSAPP   |   0 € START', roleDE: 'Fitnesstrainer' }
];

// 2. 25 Job Seeker Hooks
const SEEKER_HOOKS = [
  { r1: 'LOOKING FOR A', r2: 'MINIJOB?', sub: 'BIS 538 € STEUERFREI', tags: '1-KLICK WHATSAPP   |   KEIN ANSCHREIBEN   |   DIREKTKONTAKT', roleDE: 'Minijob' },
  { r1: 'LOOKING FOR A', r2: 'WEEKEND GIG?', sub: 'SAMSTAG & SONNTAG', tags: 'FLEXIBLE SHIFTS   |   FAIRE STUNDENLÖHNE   |   DEIN KIEZ', roleDE: 'Wochenendjob' },
  { r1: 'NEED FAST', r2: 'CASH?', sub: 'SCHNELLE AUSZAHLUNG', tags: 'TEMP GIGS   |   DIREKT BEIM CHEF   |   0% AGENTUR', roleDE: 'Nebenverdienst' },
  { r1: 'STUDENT IN', r2: 'BERLIN?', sub: 'FLEXIBLE STUDENTENJOBS', tags: 'NEBEN DER UNI   |   KEIN ATS-FORMULAR   |   WHATSAPP', roleDE: 'Studentenjob Berlin' },
  { r1: 'LOOKING FOR A', r2: 'CAFE JOB?', sub: 'BARISTA & SERVICE', tags: 'SPEZIALITÄTEN-CAFÉS   |   TRINKGELD   |   IM KIEZ', roleDE: 'Café Job' },
  { r1: 'LOOKING FOR A', r2: 'BAR JOB?', sub: 'BARKEEPER & SERVICE', tags: 'NACHT-LEBEN   |   GUTE TEAMS   |   1-KLICK KONTAKT', roleDE: 'Bar Job' },
  { r1: 'NO CV?', r2: 'NO PROBLEM.', sub: 'BEWERBEN OHNE PAPIERKRIEG', tags: 'WHATSAPP SCHREIBEN   |   VORBEIKOMMEN   |   STARTEN', roleDE: 'Job ohne Lebenslauf' },
  { r1: 'WANT FLEXIBLE', r2: 'HOURS?', sub: 'DEIN ZEITPLAN ZÄHLT', tags: 'TEILZEIT & TEMPORÄR   |   TRANSPARENTER LOHN   |   JOBROOFS', roleDE: 'Flexible Arbeitszeiten' },
  { r1: 'STUDENT IN', r2: 'HAMBURG?', sub: 'NEBENJOBS ALTONA & SCHANZE', tags: 'ALSTER BIS ELBE   |   DIREKTER DRAHT   |   0% ZEITARBEIT', roleDE: 'Studentenjob Hamburg' },
  { r1: 'STUDENT IN', r2: 'MÜNCHEN?', sub: 'MINIJOBS SCHWABING & CO.', tags: 'FAIRE BEZAHLUNG   |   1-KLICK WHATSAPP   |   JOBROOFS', roleDE: 'Studentenjob München' },
  { r1: 'LOOKING FOR A', r2: 'DRIVER GIG?', sub: 'FAHRER & KURIER', tags: 'E-BIKE & PKW   |   FLEXIBEL   |   DIREKTKONTAKT', roleDE: 'Fahrer Job' },
  { r1: 'LOOKING FOR A', r2: 'KITCHEN JOB?', sub: 'SPÜLKRAFT & BEIKOCH', tags: 'SOFORT STARTEN   |   FAMILIÄRE TEAMS   |   KIEZ-GASTRO', roleDE: 'Gastro Job' },
  { r1: 'WANT A JOB', r2: 'NEARBY?', sub: 'MAXIMAL 15 MINUTEN WEG', tags: 'KIEZ-FILTER   |   ZU FUSS ZUR ARBEIT   |   JOBROOFS', roleDE: 'Jobs in der Nähe' },
  { r1: 'LOOKING FOR A', r2: 'RETAIL GIG?', sub: 'BOUTIQUEN & CONCEPT STORES', tags: 'SCHÖNE LÄDEN   |   LIEBE ZUM PRODUKT   |   WHATSAPP', roleDE: 'Verkaufsjob' },
  { r1: 'LOOKING FOR AN', r2: 'EVENT JOB?', sub: 'KONZERTE, FESTIVALS & MESSEN', tags: 'ACTIONREICHE TAGE   |   GUT BEZAHLT   |   DIREKT', roleDE: 'Eventjob' },
  { r1: 'EARN EXTRA', r2: 'INCOME.', sub: 'NEBENBEI GELD VERDIENEN', tags: 'FÜR DEN URLAUB   |   TRANSPARENT   |   KEINE ABZOCKE', roleDE: 'Zusatzeinkommen' },
  { r1: 'WANT EVENING', r2: 'SHIFTS?', sub: 'ARBEITEN AB 18 UHR', tags: 'PERFEKT NEBEN STUDIUM   |   BARS & RESTAURANTS   |   JOBROOFS', roleDE: 'Abendjob' },
  { r1: 'STUDENT IN', r2: 'KÖLN?', sub: 'MINIJOBS EHRENFELD & SÜDSTADT', tags: 'KÖLNER KIEZE   |   1-KLICK BEWERBUNG   |   JOBROOFS', roleDE: 'Studentenjob Köln' },
  { r1: 'STUDENT IN', r2: 'FRANKFURT?', sub: 'JOBS BOCKENHEIM & SORN', tags: 'MAIN-METROPOLE   |   FAIRE STUNDENLÖHNE   |   0% AGENTUR', roleDE: 'Studentenjob Frankfurt' },
  { r1: 'WANT MORNING', r2: 'SHIFTS?', sub: 'ARBEITEN VON 6 BIS 12 UHR', tags: 'BÄCKEREIEN & CAFÉS   |   NACHMITTAG FREI   |   WHATSAPP', roleDE: 'Frühschicht Job' },
  { r1: 'SUMMER GIG', r2: 'WANTED?', sub: 'FERIENJOBS & SAISONARBEIT', tags: 'FREILUFT & GASTRO   |   SCHNELL GELD VERDIENEN   |   JOBROOFS', roleDE: 'Ferienjob' },
  { r1: 'LOOKING FOR A', r2: 'STAGE GIG?', sub: 'BÜHNENBAU & BACKSTAGE', tags: 'CREW LIFE   |   FLEXIBLE EINSÄTZE   |   DIREKTKONTAKT', roleDE: 'Bühnenjob' },
  { r1: 'LOOKING FOR A', r2: 'CLEANING GIG?', sub: 'PRAXEN, BÜROS & STUDIOS', tags: 'FAIRER LOHN   |   FESTE SCHICHTEN   |   KEIN STRESS', roleDE: 'Reinigungsjob' },
  { r1: 'OVER 18 &', r2: 'LOOKING?', sub: 'DEIN ERSTER ECHTER JOB', tags: 'OHNE VORERFAHRUNG   |   NETTE CHEFS   |   WHATSAPP', roleDE: 'Erster Nebenjob' },
  { r1: 'WANT CASH', r2: 'ON THE SIDE?', sub: 'MINIJOBS IN DEINER STADT', tags: 'SCHNELLE BEWERBUNG   |   0% ZEITARBEIT   |   JOBROOFS', roleDE: 'Minijob Deutschland' }
];

// 3. 20 Contrarian Takes / Industry Truths
const CONTRARIAN_TAKES = [
  { r1: '499 € FOR', r2: 'A JOB AD?', sub: 'STOP GETTING RIPPED OFF.', tags: 'STEPSTONE WAR GESTERN   |   JOBROOFS IST 0 €   |   FAIR', roleDE: '499 Euro Abzocke' },
  { r1: 'NOBODY UNDER 30', r2: 'SENDS A PDF.', sub: 'COMPLICATED ATS PORTALS ARE DEAD.', tags: '73% BRECHEN AB   |   WHATSAPP IST DER STANDARD   |   JOBROOFS', roleDE: 'PDF Anschreiben tot' },
  { r1: 'AGENCIES TAKE 30%.', r2: 'WE TAKE 0%.', sub: 'STOP PAYING MIDDLEMEN FEES.', tags: '100% DIREKTER DRAHT   |   KEINE ABZOCKE   |   ECHTE BETRIEBE', roleDE: '0% Zeitarbeit' },
  { r1: 'HIRING DOESN’T TAKE', r2: '3 WEEKS.', sub: 'IT TAKES 1 WHATSAPP MESSAGE.', tags: 'SCHLUSS MIT ENDLOSEN INTERVIEWS   |   EINSATZ ZÄHLT   |   JOBROOFS', roleDE: 'Schnelles Hiring' },
  { r1: 'UNPAID TRIAL DAYS', r2: 'ARE RED FLAGS.', sub: 'PAY TALENT FROM MINUTE 1.', tags: 'FAIRE ARBEIT   |   TRANSPARENTER LOHN   |   JOBROOFS STANDARD', roleDE: 'Bezahlte Probetage' },
  { r1: 'NO SALARY LISTED?', r2: 'NO APPLICANTS.', sub: 'POST HOURLY WAGES OPENLY.', tags: 'TRANSPARENZ BRINGT 4X BEWERBER   |   AB MINUTE 1   |   JOBROOFS', roleDE: 'Lohntransparenz' },
  { r1: 'FORCED ACCOUNTS', r2: 'KILL RECRUITING.', sub: 'NO CANDIDATE WANTS A NEW LOGIN.', tags: 'OHNE REGISTRIERUNG   |   1-KLICK DRAHT   |   SCHNELL & EINFACH', roleDE: 'Keine Zwangs-Logins' },
  { r1: 'TEMP AGENCIES', r2: 'DON’T CARE.', sub: 'THEY TREAT WORKERS LIKE NUMBERS.', tags: '0% ZEITARBEIT   |   NUR UNABHÄNGIGE BETRIEBE   |   JOBROOFS', roleDE: 'Gegen Zeitarbeit' },
  { r1: 'YOUR 1ST AD', r2: 'IS 100% FREE.', sub: 'NO CREDIT CARD. NO SUBSCRIPTION.', tags: 'DAUERHAFT TRANSPARENT   |   TESTE ES IN 2 MIN   |   JOBROOFS', roleDE: '0 Euro Erstinserat' },
  { r1: 'LOCAL SHOPS', r2: 'DESERVE BETTER.', sub: 'WHY SHOULD ONLY CORPORATES HIRE?', tags: 'GEBAUT FÜR KIEZ-BETRIEBE   |   GASTRO & HANDWERK   |   JOBROOFS', roleDE: 'Für den Mittelstand' },
  { r1: 'STOP ASKING FOR', r2: 'GRADE 1 IN MATH.', sub: 'WHEN YOU NEED A RELIABLE PACKER.', tags: 'ZUVERLÄSSIGKEIT > NOTEN   |   PERSÖNLICHKEIT ZÄHLT   |   JOBROOFS', roleDE: 'Noten vs Einsatz' },
  { r1: '20-PAGE FORMS?', r2: 'NOT IN 2026.', sub: 'TALENT MOVES FAST. SO SHOULD YOU.', tags: 'MOBILE FIRST   |   WHATSAPP KONTAKT   |   KEINE HÜRDEN', roleDE: 'Mobile First Hiring' },
  { r1: 'WHO PAYS 200 €', r2: 'PER CLICK ON INDEED?', sub: 'AND GETS 0 REPLIES?', tags: 'KLICK-FALLEN VERMEIDEN   |   FESTPREIS ODER GRATIS   |   JOBROOFS', roleDE: 'Indeed Klickfalle' },
  { r1: 'HIRING IS A', r2: 'HANDSHAKE.', sub: 'NOT AN ALGORITHMIC ATS PIPELINE.', tags: 'MENSCHLICH BLEIBEN   |   DIREKTER KONTAKT   |   KIEZ-SPIRIT', roleDE: 'Echtes Kennenlernen' },
  { r1: 'A BAD JOB AD', r2: 'COSTS THOUSANDS.', sub: 'A GOOD ONE TAKES 2 MINUTES.', tags: 'SCHLUSS MIT PHRASEN   |   AUF DEN PUNKT   |   JOBROOFS.COM', roleDE: 'Effizientes Inserat' },
  { r1: 'WHY WAIT FOR', r2: 'A HEADHUNTER?', sub: 'WHEN YOUR TALENT WALKS BY DAILY.', tags: 'KIEZ-REICHWEITE   |   NACHBARSCHAFTS-JOBS   |   JOBROOFS', roleDE: 'Lokale Talente' },
  { r1: 'FLEXIBLE WORK', r2: 'IS THE FUTURE.', sub: 'MINIJOBS WITHOUT BULLSHIT.', tags: 'SELBSTBESTIMMT ARBEITEN   |   DIREKT ABSTIMMEN   |   JOBROOFS', roleDE: 'Zukunft der Arbeit' },
  { r1: 'SUBSCRIPTION TRAPS', r2: 'ARE OVER.', sub: 'NEVER PAY FOR UNWANTED AUTO-RENEWS.', tags: 'VOLLE KOSTENKONTROLLE   |   1. JOB 0 €   |   JOBROOFS.COM', roleDE: 'Keine Abofalle' },
  { r1: 'APPLY IN 10 SEC.', r2: 'HIRE IN 24 HOURS.', sub: 'THE FASTEST WORKFLOW IN GERMANY.', tags: 'WHATSAPP DIRECT   |   KEIN CV UPLOAD   |   JOBROOFS', roleDE: '10 Sekunden Bewerbung' },
  { r1: 'BUILD YOUR TEAM', r2: 'IN YOUR KIEZ.', sub: 'SUPPORT INDEPENDENT LOCAL BUSINESSES.', tags: 'KEINE KONZERNE   |   ECHTE BETRIEBE   |   JOBROOFS STANDARD', roleDE: 'Kiez Zusammenhalt' }
];

// 4. 15 City & Kiez Spotlights
const KIEZ_SPOTLIGHTS = [
  { r1: 'BERLIN', r2: 'KIEZ JOBS.', sub: 'MITTE, KREUZBERG, NEUKÖLLN', tags: 'CAFÉS, CLUBS & HANDWERK   |   0% ZEITARBEIT   |   WHATSAPP', roleDE: 'Berlin Kiez' },
  { r1: 'HAMBURG', r2: 'CITY JOBS.', sub: 'ALTONA, SCHANZE, ST. PAULI', tags: 'ELBE, HAFEN & KULTUR   |   DIREKT BEWERBEN   |   JOBROOFS', roleDE: 'Hamburg Kiez' },
  { r1: 'MÜNCHEN', r2: 'LOCAL GIGS.', sub: 'SCHWABING, GLOCKENBACH & AU', tags: 'FAIRE BEZAHLUNG   |   KEIN ATS PAPIERKRIEG   |   JOBROOFS', roleDE: 'München Kiez' },
  { r1: 'KÖLN', r2: 'VEEDEL JOBS.', sub: 'EHRENFELD, BELGISCHES & SÜD', tags: 'KÖLSCHE HERZLICHKEIT   |   GASTRO & HANDWERK   |   WHATSAPP', roleDE: 'Köln Veedel' },
  { r1: 'FRANKFURT', r2: 'METRO GIGS.', sub: 'BOCKENHEIM, NORDEND, SACHSEN', tags: 'MINIJOBS & ALLROUNDER   |   DIREKTKONTAKT   |   JOBROOFS', roleDE: 'Frankfurt Kiez' },
  { r1: 'LEIPZIG', r2: 'VIERTEL JOBS.', sub: 'PLAGWITZ, CONNEWITZ & SÜD', tags: 'KREATIV & FLEXIBEL   |   0 € INSERIEREN   |   JOBROOFS', roleDE: 'Leipzig Kiez' },
  { r1: 'STUTTGART', r2: 'KESSEL GIGS.', sub: 'WEST, SÜD & MITTE', tags: 'SCHNELL BESETZEN   |   FAIRE LÖHNE   |   1-KLICK KONTAKT', roleDE: 'Stuttgart Kiez' },
  { r1: 'DÜSSELDORF', r2: 'RHEIN JOBS.', sub: 'FLINGERN, UNTERBILK & DERENDORF', tags: 'BOUTIQUEN & GASTRO   |   1. INSERAT GRATIS   |   WHATSAPP', roleDE: 'Düsseldorf Kiez' },
  { r1: 'DRESDEN', r2: 'NEUSTADT GIGS.', sub: 'BARS, ATELIERS & SHOPS', tags: 'SZENEVIERTEL   |   DIREKTER DRAHT   |   JOBROOFS', roleDE: 'Dresden Neustadt' },
  { r1: 'BREMEN', r2: 'VIERTEL JOBS.', sub: 'OSTERDEICH, STEINTOR & MITTE', tags: 'HANSEATISCH FAIR   |   0% ZEITARBEIT   |   WHATSAPP', roleDE: 'Bremen Viertel' },
  { r1: 'HANNOVER', r2: 'LINDEN JOBS.', sub: 'LINDEN, NORDSTADT & LIST', tags: 'STUDENTEN & AUSHILFEN   |   SCHNELL LIVE   |   JOBROOFS', roleDE: 'Hannover Kiez' },
  { r1: 'NÜRNBERG', r2: 'FRANKEN GIGS.', sub: 'GOHO, ST. JOHANNIS & MITTE', tags: 'LOKALE BETRIEBE   |   TRANSPARENTER LOHN   |   JOBROOFS', roleDE: 'Nürnberg Kiez' },
  { r1: 'BONN', r2: 'ALTSTADT JOBS.', sub: 'KIRSCHBLÜTE & KIEZ-SHOPS', tags: 'GEMÜTLICH & DIREKT   |   KEIN ATS   |   WHATSAPP', roleDE: 'Bonn Altstadt' },
  { r1: 'MÜNSTER', r2: 'LEEZE GIGS.', sub: 'KREUZVIERTEL & HAFEN', tags: 'FAHRRADSTADT JOBS   |   STUDENTEN & AUSHILFEN   |   JOBROOFS', roleDE: 'Münster Kiez' },
  { r1: 'FREIBURG', r2: 'SONNEN JOBS.', sub: 'STÜHLINGER & HERDERN', tags: 'BIO, CAFÉ & HANDWERK   |   100% DIREKT   |   JOBROOFS', roleDE: 'Freiburg Kiez' }
];

// 5. 12 Jobroofs Rules / Manifestos
const MANIFESTO_RULES = [
  { r1: 'RULE #1:', r2: '0% ZEITARBEIT.', sub: 'NUR ECHTE, LOKALE ARBEITGEBER.', tags: 'KEINE PERSONALDIENSTLEISTER   |   KEINE NUMMER   |   JOBROOFS', roleDE: 'Regel 1' },
  { r1: 'RULE #2:', r2: '1ST POST IS FREE.', sub: 'TESTEN OHNE JEDES RISIKO.', tags: 'KEINE KREDITKARTE   |   KEIN ABO   |   JOBROOFS.COM', roleDE: 'Regel 2' },
  { r1: 'RULE #3:', r2: 'WHATSAPP DIRECT.', sub: 'BEWERBEN SO SCHNELL WIE CHATTEN.', tags: 'DIREKT AUFS SMARTPHONE   |   KEIN ATS   |   1-KLICK', roleDE: 'Regel 3' },
  { r1: 'RULE #4:', r2: 'TRANSPARENT WAGE.', sub: 'STUNDENLOHN AB MINUTE 1.', tags: 'KEINE GEHEIMNISSE   |   FAIRE ARBEIT   |   JOBROOFS', roleDE: 'Regel 4' },
  { r1: 'RULE #5:', r2: '2 MIN TO POST.', sub: 'EINFACHER ALS EIN KAFFEE.', tags: 'INSERIEREN IN 120 SEKUNDEN   |   SOFORT LIVE   |   JOBROOFS', roleDE: 'Regel 5' },
  { r1: 'RULE #6:', r2: 'KIEZ OVER CORP.', sub: 'WIR UNTERSTÜTZEN DIE KLEINEN.', tags: 'CAFÉS, HANDWERK & BOUTIQUEN   |   DEINE NACHBARN   |   JOBROOFS', roleDE: 'Regel 6' },
  { r1: 'RULE #7:', r2: 'NO AUTO-RENEW.', sub: 'KEINE VERSTECKTEN ABONNEMENTS.', tags: 'VOLLE KOSTENKONTROLLE   |   FAIRNESS FIRST   |   JOBROOFS', roleDE: 'Regel 7' },
  { r1: 'RULE #8:', r2: 'SKILLS > GRADES.', sub: 'EINSATZ ZÄHLT MEHR ALS EIN ZEUGNIS.', tags: 'ZUVERLÄSSIGKEIT GEWINNT   |   ECHTE CHANCEN   |   JOBROOFS', roleDE: 'Regel 8' },
  { r1: 'RULE #9:', r2: 'MOBILE FIRST.', sub: 'RECUTING FÜR DIE HEUTIGE GENERATION.', tags: 'SMARTPHONE BEWERBUNG   |   KEINE DRUCKER   |   JOBROOFS', roleDE: 'Regel 9' },
  { r1: 'RULE #10:', r2: 'COMMUNITY FIRST.', sub: 'WIR VERBINDEN KIEZ & TALENT.', tags: 'FÜR EINE LEBENDIGE STADT   |   ZUSAMMENHALT   |   JOBROOFS', roleDE: 'Regel 10' },
  { r1: 'RULE #11:', r2: 'FAST RESPONSE.', sub: 'KEINE WOCHENLANGEN WARTEZEITEN.', tags: 'DIREKTER CHAT   |   SCHNELLE ANTWORT   |   JOBROOFS STANDARD', roleDE: 'Regel 11' },
  { r1: 'RULE #12:', r2: 'BE PROUD OF WORK.', sub: 'JEDE SCHICHT VERDIENT RESPEKT.', tags: 'VOM BARISTA BIS ZUM MONTEUR   |   JOBROOFS.COM', roleDE: 'Regel 12' }
];

// Combine all 102 posts into strategic 34-day calendar (3 posts / day)
const ALL_CONCEPTS = [
  ...EMPLOYER_ROLES.map(p => ({ ...p, pillar: 'employer' })),
  ...SEEKER_HOOKS.map(p => ({ ...p, pillar: 'seeker' })),
  ...CONTRARIAN_TAKES.map(p => ({ ...p, pillar: 'contrarian' })),
  ...KIEZ_SPOTLIGHTS.map(p => ({ ...p, pillar: 'kiez' })),
  ...MANIFESTO_RULES.map(p => ({ ...p, pillar: 'manifesto' }))
];

console.log(`Total concepts prepared: ${ALL_CONCEPTS.length}`);

// Weave them into 34 days with 3 distinct daily slots
const scheduledPosts = [];
let empIdx = 0;
let conIdx = 0;
let seekIdx = 0;
let kiezIdx = 0;
let manIdx = 0;

for (let day = 1; day <= 34; day++) {
  // Slot 1 (Morning 08:30): Employer Action Hook
  const emp = EMPLOYER_ROLES[empIdx++ % EMPLOYER_ROLES.length];
  const color1 = paletteKeys[(day * 3) % paletteKeys.length];

  scheduledPosts.push({
    id: (day - 1) * 3 + 1,
    day,
    slot: 'morning',
    time: '08:30 CET',
    pillar: 'employer',
    role1: emp.r1,
    role2: emp.r2,
    subline: emp.sub,
    tags: emp.tags,
    buttonText: 'POST AT JOBROOFS',
    colorway: color1,
    palette: PALETTES[color1],
    germanCaption: `${emp.r1} ${emp.r2} Post at JOBROOFS. 🏢⚡\n\nDu suchst Verstärkung für deinen Betrieb (${emp.roleDE})?\nSchluss mit 499 € Anzeigen und Zeitarbeitsfirmen.\n\nAuf JOBROOFS inserierst du direkt:\n✓ Dein 1. Inserat ist 100% kostenlos\n✓ 1-Klick WhatsApp Direktkontakt\n✓ 0% Zeitarbeit – nur echte lokale Betriebe\n\n👉 Schalte deine Stelle in 2 Minuten kostenlos online: jobroofs.com/post-a-job (Link in Bio)\n\n#stellenanzeige #mitarbeitersuche #jobroofs #unternehmer #arbeitgeber #mittelstand #recruiting #minijob #kiezjobs`
  });

  // Slot 2 (Midday 13:00): Contrarian Take OR Manifesto
  const isContrarian = (day % 2 === 1);
  const midItem = isContrarian
    ? CONTRARIAN_TAKES[conIdx++ % CONTRARIAN_TAKES.length]
    : MANIFESTO_RULES[manIdx++ % MANIFESTO_RULES.length];
  const color2 = paletteKeys[(day * 3 + 1) % paletteKeys.length];

  scheduledPosts.push({
    id: (day - 1) * 3 + 2,
    day,
    slot: 'midday',
    time: '13:00 CET',
    pillar: isContrarian ? 'contrarian' : 'manifesto',
    role1: midItem.r1,
    role2: midItem.r2,
    subline: midItem.sub,
    tags: midItem.tags,
    buttonText: 'JOBROOFS.COM',
    colorway: color2,
    palette: PALETTES[color2],
    germanCaption: `${midItem.r1} ${midItem.r2} 🛑\n\n${midItem.sub}\n\nWarum wir JOBROOFS gebaut haben:\nRecruiting in Deutschland ist kaputt. Komplizierte Portale verlangen hunderte Euro und zwingen Bewerber durch endlose Formulare.\n\nJOBROOFS macht es einfach:\n1️⃣ 0 € Erstinserat für Betriebe.\n2️⃣ 1-Klick WhatsApp Kontakt für Bewerber.\n3️⃣ 0% Zeitarbeit – dauerhaft.\n\n👉 Sei Teil des Wandels auf jobroofs.com (Link in Bio)\n\n#recruitingtipps #jobportal #unternehmertum #arbeitgeber #fachkräftemangel #gastroberlin #handwerk #mittelstand #jobroofs`
  });

  // Slot 3 (Evening 19:30): Seeker Hook OR Kiez Spotlight
  const isKiez = (day % 3 === 0);
  const eveItem = isKiez
    ? KIEZ_SPOTLIGHTS[kiezIdx++ % KIEZ_SPOTLIGHTS.length]
    : SEEKER_HOOKS[seekIdx++ % SEEKER_HOOKS.length];
  const color3 = paletteKeys[(day * 3 + 2) % paletteKeys.length];

  scheduledPosts.push({
    id: (day - 1) * 3 + 3,
    day,
    slot: 'evening',
    time: '19:30 CET',
    pillar: isKiez ? 'kiez' : 'seeker',
    role1: eveItem.r1,
    role2: eveItem.r2,
    subline: eveItem.sub,
    tags: eveItem.tags,
    buttonText: isKiez ? 'ENTDECKE DEINEN KIEZ' : 'FINDE DEINEN GIG',
    colorway: color3,
    palette: PALETTES[color3],
    germanCaption: `${eveItem.r1} ${eveItem.r2} ✨\n\n${eveItem.sub}\n\nSuchst du einen flexiblen Job oder Minijob in deiner Nähe?\nBei JOBROOFS bewirbst du dich ohne Anschreiben und ohne Lebenslauf-Upload:\n\n✓ Transparente Stundenlöhne ab Minute 1\n✓ 1 Klick und du chattest direkt mit dem Betrieb per WhatsApp\n✓ Keine nervigen Zeitarbeitsfirmen\n\n👉 Finde deinen nächsten Gig jetzt auf jobroofs.com (Link in Bio)\n\n#minijob #nebenjob #studentenjob #flexibelarbeiten #kiezjobs #gastrojobs #jobroofs #berlinjobs #hamburgjobs #muenchenjobs`
  });
}

const outputPath = path.join(dataDir, 'campaign-100-posts.json');
fs.writeFileSync(outputPath, JSON.stringify(scheduledPosts, null, 2));
console.log(`✅ Successfully generated ${scheduledPosts.length} posts in: ${outputPath}`);
