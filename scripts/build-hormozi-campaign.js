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

/**
 * 30 GERMAN HORMOZI EMPLOYER HOOKS
 * Structure: Brutal value equation in native German.
 */
const GERMAN_EMPLOYER_POSTS = [
  {
    r1: 'AUSHILFE',
    r2: 'GESUCHT?',
    sub: 'SCHLUSS MIT 500 € FÜR STELLENANZEIGEN.',
    tags: '0 € ERSTINSERAT   |   1-KLICK WHATSAPP   |   0% ZEITARBEIT',
    btn: 'JETZT KOSTENLOS INSERIEREN',
    hook: 'Warum zahlen Betriebe 2026 immer noch 499 € für ein einziges Inserat, nur um dann geghostet zu werden?',
    pain: 'Hier ist die brutale Mathematik: Du gibst 500 € bei StepStone aus. 73% der Bewerber brechen ab, weil sie ein 4-seitiges PDF hochladen müssen. Am Ende hast du 0 Mitarbeiter und 500 € verbrannt.',
    math: 'Der Hormozi-Standard für Hiring heißt: Reibung auf null senken. Der Bewerber schreibt dir direkt per WhatsApp. Keine Agentur dazwischen.',
    offer: 'Unser Grand Slam Offer an dich: Dein 1. Inserat kostet exakt 0 €. Keine Kreditkarte. Kein Abo. Wenn du jemanden findest, hast du 500 € gespart. Wenn nicht, hast du 0 € verloren. Wer jetzt nein sagt, hasst Geld.'
  },
  {
    r1: 'BARISTA',
    r2: 'GESUCHT?',
    sub: 'DEINE SCHICHTEN SIND NICHT GRUNDLOS LEER.',
    tags: 'WHATSAPP DIREKT   |   0 € ANZEIGE   |   SCHNELLES HIRING',
    btn: 'JETZT STELLE SCHALTEN',
    hook: 'Wenn dein Café keine Baristas findet, liegt es nicht am Fachkräftemangel. Es liegt an deinem 12-Schritte-Bewerbungsprozess.',
    pain: 'Niemand unter 30 füllt für einen 16-Euro-Stundenlohn ein Online-Formular mit Lebenslauf-Upload aus. Talent will wissen: Was ist der Stundenlohn? Wo ist der Laden? Wann geht es los?',
    math: 'Je schneller der Kontakt, desto höher die Abschlussquote. Bei Jobroofs schreibt dir der Barista mit 1 Klick per WhatsApp.',
    offer: 'Schalte deine offene Schicht jetzt kostenlos online. In 120 Sekunden live auf jobroofs.com/post-a-job.'
  },
  {
    r1: 'FAHRER',
    r2: 'GESUCHT?',
    sub: 'AGENTUREN KASSIEREN 30%. WIR 0%.',
    tags: 'KEINE VERMITTLER   |   100% DIREKT   |   0 € RISIKO',
    btn: 'JETZT INSERIEREN',
    hook: 'Zeitarbeitsfirmen kassieren 30% bis 40% Marge auf jede einzelne Stunde, die dein Fahrer schwitzt. Für eine Excel-Tabelle.',
    pain: 'Das ist kein Business-Service. Das ist ein Parasitenmodell. Schneide den Zwischenhändler raus.',
    math: 'Fahrer wollen einen fairen Lohn und direkten Kontakt zum Chef. Unternehmen wollen Zuverlässigkeit und keine monatlichen Knebelverträge.',
    offer: 'Inseriere deinen Fahrer-Job heute zu 100% kostenlos auf JOBROOFS. Direktkontakt auf dein Handy.'
  },
  {
    r1: 'KOCH',
    r2: 'GESUCHT?',
    sub: 'DIE KÜCHE BRENNT. HIRE HEUTE.',
    tags: 'SOFORT-KONTAKT   |   KEIN BULLSHIT   |   1. POST 0 €',
    btn: 'STELLE IN 2 MIN LIVE',
    hook: 'Deine Küche brennt am Samstagabend und du wartest 3 Wochen auf Bewerbungen von alten Jobportalen?',
    pain: 'Klassische Jobbörsen sind für 9-to-5 Büro-Jobs gebaut. In der Gastro brauchst du heute eine Lösung, nicht nächsten Monat.',
    math: '1 Klick WhatsApp = Antwort in 2 Stunden. Das ist der Unterschied zwischen vollem Betrieb und Schließtag.',
    offer: 'Dein erstes Küchen-Inserat ist 100% gratis auf jobroofs.com/post-a-job.'
  },
  {
    r1: 'KASSIERER',
    r2: 'GESUCHT?',
    sub: 'MACH ES BEWERBERN EINFACH.',
    tags: 'KIEZ-REICHWEITE   |   WHATSAPP   |   0 € START',
    btn: 'JETZT INSERIEREN (0 €)',
    hook: 'Warum verlangen Einzelhändler ein polizeiliches Führungszeugnis im Erstkontakt für einen Minijob an der Kasse?',
    pain: 'Du vergraulst die besten Leute aus deinem eigenen Kiez, bevor sie deinen Laden überhaupt betreten haben.',
    math: 'Zuverlässigkeit & Ausstrahlung testest du im 5-Minuten-Chat, nicht auf 3 Seiten Zeugnissen.',
    offer: 'Finde Store-Staff aus deiner Nachbarschaft. 1. Anzeige gratis auf JOBROOFS.'
  },
  {
    r1: 'REINIGUNGSKRAFT',
    r2: 'GESUCHT?',
    sub: 'ZUVERLÄSSIGKEIT SCHLÄGT NOTEN.',
    tags: 'ECHTE KRÄFTE   |   100% DIREKT   |   0 € INSERAT',
    btn: 'JETZT POSTEN',
    hook: 'Gute Reinigungskräfte findest du nicht mit 20-seitigen Stellenbeschreibungen. Du findest sie mit Transparenz und Respekt.',
    pain: 'Nenne den Stundenlohn ab Minute 1. Ermögliche direkte Kontaktaufnahme.',
    math: 'Transparenter Lohn = 4x mehr Bewerber am ersten Tag.',
    offer: 'Inseriere deine Stelle in 2 Minuten auf jobroofs.com.'
  },
  {
    r1: 'KELLNER',
    r2: 'GESUCHT?',
    sub: 'SCHICHTEN BESETZEN. KEIN PAPIERKRIEG.',
    tags: 'SOFORT-CHAT   |   KIEZ-TALENTE   |   KEIN ABO',
    btn: 'JETZT INSERIEREN',
    hook: 'Ein Anschreiben sagt dir, wie gut jemand lügen kann. Ein Probetag zeigt dir, wie gut jemand arbeitet.',
    pain: 'Hör auf, nach Anschreiben zu fragen. Schau dir an, wie schnell jemand auf WhatsApp antwortet.',
    math: 'Reaktionszeit ist der beste Indikator für Arbeitsmoral.',
    offer: 'Schalte dein Service-Inserat für 0 € auf JOBROOFS.'
  },
  {
    r1: 'SPÜLKRAFT',
    r2: 'GESUCHT?',
    sub: 'SCHNELLIGKEIT IST DIE EINZIGE METRIK.',
    tags: 'SAME DAY HIRING   |   1-KLICK WHATSAPP   |   0 €',
    btn: 'SOFORT INSERIEREN',
    hook: 'Wenn dein Spüler ausfällt, spülst du selbst. Es sei denn, dein Hiring dauert 10 Sekunden.',
    pain: 'Alte Portale brauchen 2 Tage allein für die Freigabe deiner Anzeige. Lächerlich.',
    math: 'Auf JOBROOFS ist deine Stelle in 120 Sekunden live.',
    offer: 'Dein erstes Inserat ist 100% kostenlos. Keine Kreditkarte.'
  },
  {
    r1: 'MALER',
    r2: 'GESUCHT?',
    sub: 'ECHTES HANDWERK. ZERO CORPORATE BULLSHIT.',
    tags: 'LOKALE BETRIEBE   |   FAIRE ARBEIT   |   JOBROOFS',
    btn: 'HANDWERK SCHALTEN',
    hook: 'Handwerker lachen über Bewerbungsportale mit Persönlichkeitstests. Sie wollen wissen: Welches Projekt? Welcher Lohn?',
    pain: 'Kleine Handwerksbetriebe gehen auf Indeed im Zeitarbeitsmüll unter.',
    math: 'Jobroofs hat 0% Zeitarbeit. Nur echte Betriebe.',
    offer: 'Inseriere dein Handwerk gratis auf jobroofs.com/post-a-job.'
  },
  {
    r1: 'ELEKTRIKER',
    r2: 'GESUCHT?',
    sub: 'SPARE DIR DIE 5.000 € HEADHUNTER-GEBÜHR.',
    tags: 'KEINE PROVISION   |   DIREKTER DRAHT   |   0 € START',
    btn: 'JETZT POSTEN (0 €)',
    hook: 'Headhunter verlangen 5.000 € für einen Elektriker. Warum bezahlst du das?',
    pain: 'Weil du glaubst, es gäbe keine Alternative. Jetzt gibt es JOBROOFS.',
    math: 'Direkter Draht zum Fachmann ohne Vermittlergebühr spart dir tausende Euro.',
    offer: 'Inseriere deine Stelle kostenlos auf JOBROOFS.'
  }
];

// Extend with 20 more German roles
const MORE_GERMAN_ROLES = [
  ['TISCHLER', 'GESUCHT?', 'Tischler & Schreiner', 'ECHTES HANDWERK   |   0% VERMITTLER'],
  ['EMPFANGSKRAFT', 'GESUCHT?', 'Praxis & Empfang', 'WHATSAPP DIREKT   |   0 € START'],
  ['KOMMISSIONIERER', 'GESUCHT?', 'Lager & Versand', 'FLEXIBLE SHIFTS   |   0% AGENTUR'],
  ['SICHERHEITSKRAFT', 'GESUCHT?', 'Event & Objektschutz', 'SCHNELLE ANTWORT   |   KEIN ABO'],
  ['GÄRTNER', 'GESUCHT?', 'Garten & Landschaftsbau', 'GRÜNE DAUMEN   |   KIEZ-BETRIEBE'],
  ['STAGEHAND', 'GESUCHT?', 'Event, Messe & Bühne', 'ANPACKER GESUCHT   |   FLEXIBEL'],
  ['DOG WALKER', 'GESUCHT?', 'Tierbetreuung & Service', 'TIERLIEB   |   DIREKTER KONTAKT'],
  ['KURIERFAHRER', 'GESUCHT?', 'E-Bike & PKW Kurier', 'SCHNELLE LIEFERUNG   |   WHATSAPP'],
  ['BARBACK', 'GESUCHT?', 'Club & Bar Support', 'NACHT-SHIFTS   |   1. JOB 0 €'],
  ['HOSTESS', 'GESUCHT?', 'Messe & Event Promo', 'MESSE & PROMO   |   KEIN ATS'],
  ['PROMOTER', 'GESUCHT?', 'Street & Event Marketing', '1-KLICK BEWERBUNG   |   JOBROOFS'],
  ['NACHHILFELEHRER', 'GESUCHT?', 'Nachhilfe & Training', 'WISSEN WEITERGEBEN   |   0 € AD'],
  ['BABYSITTER', 'GESUCHT?', 'Familien & Betreuung', 'VERTRAUENSVOLL   |   IM KIEZ'],
  ['FAHRRADMECHANIKER', 'GESUCHT?', 'Fahrradwerkstatt', 'SCHRAUBER GESUCHT   |   DIREKT'],
  ['UMZUGSHELFER', 'GESUCHT?', 'Transport & Möbel', 'STARKE HÄNDE   |   SCHNELL BESETZEN'],
  ['VERKÄUFER', 'GESUCHT?', 'Boutiquen & Concept Stores', 'LADENINHABER   |   KEINE ABZOCKE'],
  ['MONTEUR', 'GESUCHT?', 'Montage & Service', 'UNTERWEGS IM KIEZ   |   JOBROOFS'],
  ['FRISEUR', 'GESUCHT?', 'Salon & Barbershop', 'SALON & STYLE   |   0% AGENTUR'],
  ['TÄTOWIERER', 'GESUCHT?', 'Studio & Guest Spot', 'PORTFOLIO DIRECT   |   KEIN ATS'],
  ['FITNESSTRAINER', 'GESUCHT?', 'Studio & Kurse', 'TRAINER GESUCHT   |   1. POST 0 €']
];

MORE_GERMAN_ROLES.forEach(([r1, r2, roleDE, tags]) => {
  GERMAN_EMPLOYER_POSTS.push({
    r1,
    r2,
    sub: 'SCHNEIDE DEN ZWISCHENHÄNDLER RAUS.',
    tags: `${tags}   |   0 € START`,
    btn: 'JETZT INSERIEREN (0 €)',
    roleDE,
    hook: `Du suchst ${roleDE} für deinen Betrieb? Hör auf, dein Geld bei alten Portalen zu verbrennen.`,
    pain: 'Alte Portale verlangen hunderte Euro für Schaufenster-Anzeigen, die niemand sieht.',
    math: 'Bei JOBROOFS landest du direkt auf dem Smartphone der Bewerber per WhatsApp.',
    offer: 'Dein 1. Inserat ist 100% kostenlos. Keine Kreditkarte, kein Abo auf jobroofs.com/post-a-job.'
  });
});

/**
 * 25 GERMAN CONTRARIAN TRUTHS (HORMOZI STYLE)
 */
const GERMAN_CONTRARIAN_POSTS = [
  {
    r1: '499 € FÜR',
    r2: 'EINE ANZEIGE?',
    sub: 'DU WIRST GERADE LEGAL BESTOHLEN.',
    tags: 'STEPSTONE WAR GESTERN   |   JOBROOFS IST 0 €   |   AUFWACHEN',
    btn: 'WARUM NOCH ZAHLEN?',
    hook: 'Wer 2026 noch 499 € für eine Stellenanzeige bezahlt, betreibt kein Recruiting. Er verbrennt Geld.',
    body: 'Große Jobbörsen leben davon, dass du aus reiner Gewohnheit zahlst. Sie garantieren dir 0 Bewerber. 0 Einstellungen. Nur eine PDF-Rechnung.\n\nWir haben das System umgedreht: Dein 1. Inserat auf JOBROOFS ist 100% kostenlos. Warum? Weil wir an unser Produkt glauben.',
    offer: 'Teste den neuen Standard: jobroofs.com/post-a-job'
  },
  {
    r1: 'NIEMAND UNTER 30',
    r2: 'SCHICKT EIN PDF.',
    sub: 'DEIN 14-SCHRITTE-PORTAL IST TOT.',
    tags: '73% ABBRUCHQUOTE   |   WHATSAPP GEWINNT   |   FAST HIRING',
    btn: 'REIBUNG AUF NULL',
    hook: '73% aller Bewerber brechen den Prozess ab, wenn sie ein Konto anlegen oder ein Anschreiben hochladen müssen.',
    body: 'Wenn du dich fragst, warum sich niemand auf deine Stelle meldet: Dein Bewerbungsprozess ist für das Jahr 2004 gebaut.\n\nTalent bewegt sich schnell. Auf JOBROOFS bewerben sich Leute mit 1 Klick per WhatsApp. Direkt auf dein Handy.',
    offer: 'Mach Bewerben einfach. Inseriere jetzt kostenlos auf jobroofs.com.'
  },
  {
    r1: 'AGENTUREN NEHMEN 30%.',
    r2: 'WIR NEHMEN 0%.',
    sub: 'STOPPE PARASITEN-PROVISIONEN.',
    tags: '0% ZEITARBEIT   |   100% DIREKT   |   BEHALTE DEIN GELD',
    btn: '0% PROVISION SCHALTEN',
    hook: 'Personalvermittler nehmen 30% bis 40% deiner Marge für das Versenden einer E-Mail.',
    body: 'Schneide den Parasiten aus deiner Wertschöpfungskette. Vernetze dich direkt mit Arbeitskräften in deinem Kiez.\n\nAuf JOBROOFS gibt es 0% Zeitarbeit. Nur echte Inhaber und echte Mitarbeiter.',
    offer: 'Schalte deine Anzeige ohne Provision: jobroofs.com'
  },
  {
    r1: 'EINSTELLEN DAUERT',
    r2: 'KEINE 3 WOCHEN.',
    sub: 'ES DAUERT 1 WHATSAPP-NACHRICHT.',
    tags: 'SPEED WINS   |   SCHNELLIGKEIT ZÄHLT   |   JOBROOFS',
    btn: 'IN 2 STUNDEN BESETZEN',
    hook: 'Geschwindigkeit ist der einzige Wettbewerbsvorteil, den Großkonzerne nicht kopieren können.',
    body: 'Während Konzerne 3 Wochen für ein Erstgespräch brauchen, kannst du auf JOBROOFS innerhalb von 2 Stunden jemanden einstellen.\n\nKlick. Chat. Vorbeikommen. Handschlag. Erledigt.',
    offer: 'Gewinne das Recruiting-Rennen auf jobroofs.com/post-a-job.'
  },
  {
    r1: 'UNBEZAHLTE PROBETAGE',
    r2: 'SIND ABZOCKE.',
    sub: 'BEZAHLE TALENT AB MINUTE 1.',
    tags: 'FAIRE ARBEIT   |   RESPEKT VOR LEISTUNG   |   JOBROOFS',
    btn: 'FAIRNESS ALS STANDARD',
    hook: 'Wer unbezahlte Probetage verlangt, signalisiert eine Sache: Dieser Betrieb spart am Personal.',
    body: 'A-Player meiden unbezahlte Probetage wie die Pest. Zahle die 2 Stunden Probearbeit bar oder per Überweisung. Du wirst sofort die besten Leute anziehen.',
    offer: 'Setze auf Fairness. Rekrutiere über jobroofs.com.'
  },
  {
    r1: 'KEIN LOHN GENANNT?',
    r2: 'NULL BEWERBER.',
    sub: 'TRANSPARENZ BRINGT 4X MEHR ANFRAGEN.',
    tags: 'STUNDENLOHN OFFEN   |   KEINE GEHEIMNISSE   |   JOBROOFS',
    btn: 'OFFEN INSERIEREN',
    hook: '„Gehalt nach Vereinbarung“ bedeutet für Bewerber: „Wir zahlen so wenig wie möglich.“',
    body: 'Nenne den Stundenlohn ab Minute 1. Unternehmen, die den Lohn transparent angeben, erhalten im Schnitt 412% mehr qualifizierte Anfragen.',
    offer: 'Sei transparent. Inseriere auf jobroofs.com.'
  },
  {
    r1: 'ZWANGS-LOGINS',
    r2: 'TÖTEN BEWERBER.',
    sub: 'NIEMAND WILL NOCH EIN PASSWORT.',
    tags: 'ZERO FRICTION   |   1-KLICK WHATSAPP   |   MOBILE FIRST',
    btn: 'OHNE ANMELDUNG BEWERBEN',
    hook: 'Jeder zusätzliche Klick in deinem Bewerbungsformular halbiert deine Bewerberzahl.',
    body: 'Bewerber müssen ein Passwort mit Sonderzeichen erstellen? 50% weg. Lebenslauf hochladen? Weitere 50% weg. Motivationsschreiben? Nochmal 50% weg.\n\nAm Ende bleiben nur Verzweifelte übrig. Eliminiere die Hürden.',
    offer: '1-Klick WhatsApp Bewerbung auf jobroofs.com.'
  },
  {
    r1: 'ZEITARBEITSFIRMEN',
    r2: 'BEUTEN AUS.',
    sub: 'MENSCHEN SIND KEINE EXCEL-ZEILEN.',
    tags: '0% ZEITARBEIT   |   ECHTE BETRIEBE   |   JOBROOFS',
    btn: 'FÜR ECHTE ARBEIT',
    hook: 'Zeitarbeitsfirmen schaden beiden Seiten: Sie beuten Arbeitnehmer aus und übervorteilen Betriebe.',
    body: 'Wir haben JOBROOFS gegründet, um das zu beenden. Direkte Verbindung zwischen lokalem Inhaber und lokalen Talenten. Punkt.',
    offer: 'Schließe dich der Bewegung an: jobroofs.com'
  },
  {
    r1: 'DEIN 1. INSERAT',
    r2: 'IST 100% GRATIS.',
    sub: 'KEINE KREDITKARTE. KEIN ABO-TRICK.',
    tags: 'VOLL TRANSPARENT   |   IN 2 MINUTEN LIVE   |   JOBROOFS',
    btn: 'GRATIS STARTEN',
    hook: 'Hier ist unser Grand Slam Offer an jeden Betrieb in Deutschland:',
    body: '1. Schalte deine Stelle kostenlos.\n2. Keine Kreditkarte hinterlegen.\n3. Kein automatisches Verlängerungs-Abo.\n4. Bewerber schreiben dir direkt auf WhatsApp.\n\nWenn du jemanden findest: Du hast gesiegt. Wenn nicht: Du hast 0 € gezahlt.\nWarum buchst du noch woanders?',
    offer: 'Nimm das Angebot an: jobroofs.com/post-a-job'
  },
  {
    r1: 'DIE VALUE',
    r2: 'EQUATION.',
    sub: 'SO REVOLUTIONIERT JOBROOFS RECRUITING.',
    tags: 'ERGEBNIS / ZEITVERZÖGERUNG   |   0 AUFWAND   |   0 €',
    btn: 'DAS SYSTEM VERSTEHEN',
    hook: 'Alex Hormozi’s Value Equation erklärt, warum alte Jobbörsen sterben:',
    body: 'Traumergebnis (Zuverlässiger Mitarbeiter) ÷ (Wartezeit × Aufwand).\n\nAlte Portale: 3 Wochen Wartezeit + riesiger Aufwand + 499 € = Wert nahe Null.\nJOBROOFS: 2 Stunden Wartezeit + 1 Klick WhatsApp + 0 € = Unschlagbarer Wert.',
    offer: 'Erlebe den Unterschied selbst: jobroofs.com'
  }
];

const MORE_GERMAN_CONTRARIANS = [
  ['FRAGE NICHT NACH', 'EINER MATHE-NOTE.', 'Wenn du einen zuverlässigen Lagerhelfer brauchst. Einsatz > Noten.'],
  ['200 € BEI INDEED?', 'FÜR 0 ANTWORTEN.', 'Klick-Fallen saugen kleine Unternehmen aus. Festpreis oder gratis.'],
  ['EINSTELLEN IST', 'EIN HANDSCHLAG.', 'Kein bürokratischer KI-Lebenslauf-Scanner.'],
  ['EIN SCHLECHTER JOB', 'KOSTET 10.000 €.', 'Ein gutes Inserat dauert 2 Minuten auf Jobroofs.'],
  ['WARUM HEADHUNTER?', 'FÜR EINEN BARISTA?', 'Deine besten Leute laufen täglich an deiner Ladentür vorbei.'],
  ['FLEXIBLE ARBEIT', 'IST UNUMGÄNGLICH.', 'Passe deine Schichten an oder sieh zu, wie die Konkurrenz abwirbt.'],
  ['ABO-FALLEN', 'SIND VORBEI.', 'Bezahle nie wieder für ungewollte automatische Verlängerungen.'],
  ['IN 10 SEKUNDEN BEWERBEN.', 'IN 24 STUNDEN EINSTELLEN.', 'Die schnellste Recruiting-Pipeline Deutschlands.'],
  ['POLARISIERE ODER', 'GEH UNTER.', 'Steh für deine Werte oder ertrinke im Konzern-Geplänkel.'],
  ['GEN Z IST NICHT FAUL.', 'SIE HASST BULLSHIT.', 'Gib ihnen fairen Lohn, klare Aufgaben und 0 Bürokratie.'],
  ['DEINE KULTUR', 'IST DEIN HIRING.', 'Behandle dein Team gut und sie bringen ihre Freunde mit.'],
  ['ERFAHRUNG WIRD', 'ÜBERSCHÄTZT.', 'Stelle nach Haltung ein, trainiere das Können. Immer.'],
  ['RECRUITING IST SALES.', 'VERKAUFE DEINE SCHICHT.', 'Behandle Bewerber wie deine besten Gäste.'],
  ['KEIN ATS NÖTIG.', 'EINFACH REDEN.', 'Die besten Einstellungen entstehen bei einem schnellen Kaffee.'],
  ['KLEINE BETRIEBE', 'TRAGEN DEUTSCHLAND.', 'JOBROOFS wurde gebaut, um sie stark zu machen.']
];

MORE_GERMAN_CONTRARIANS.forEach(([r1, r2, sub]) => {
  GERMAN_CONTRARIAN_POSTS.push({
    r1,
    r2,
    sub,
    tags: 'KLARTEXT   |   HORMOZI STANDARD   |   JOBROOFS',
    btn: 'JOBROOFS.COM',
    hook: `${r1} ${r2} Die Wahrheit über modernes Recruiting in Deutschland:`,
    body: `${sub}\n\nSchluss mit alten Ausreden und teuren Fehlern. Rekrutiere direkt und ohne Reibungsverlust auf JOBROOFS.`,
    offer: 'Starte jetzt kostenlos: jobroofs.com/post-a-job'
  });
});

/**
 * 25 GERMAN JOBSEEKER HOOKS
 */
const GERMAN_SEEKER_POSTS = [
  { r1: 'SUCHST DU EINEN', r2: 'MINIJOB?', sub: 'BIS 538 € STEUERFREI. 0 PAPIERKRIEG.', tags: '1-KLICK WHATSAPP   |   KEIN LEBENSLAUF   |   FAIRER LOHN', btn: 'JETZT MINIJOB FINDEN' },
  { r1: 'BRAUCHST DU CASH', r2: 'DIESES WOCHENENDE?', sub: 'FLEXIBLE SHIFTS IN DEINEM KIEZ.', tags: 'SAMSTAG & SONNTAG   |   DIREKTKONTAKT   |   JOBROOFS', btn: 'GIGS IN DEINER NÄHE' },
  { r1: 'BEWIRB DICH PER', r2: 'WHATSAPP.', sub: 'IN 10 SEKUNDEN. OHNE LEBENSLAUF.', tags: 'EINSATZ ZÄHLT   |   KEIN ATS   |   ECHTE CHEFS', btn: 'DIREKT CHATTEN' },
  { r1: 'STUDENT IN', r2: 'BERLIN?', sub: 'JOBS IN MITTE, KREUZBERG & NEUKÖLLN.', tags: 'NEBEN DER UNI   |   TRANSPARENTER LOHN   |   JOBROOFS', btn: 'BERLIN JOBS ANSEHEN' },
  { r1: 'STUDENT IN', r2: 'HAMBURG?', sub: 'MINIJOBS IN ALTONA & SCHANZE.', tags: 'ELBE BIS ALSTER   |   0% ZEITARBEIT   |   WHATSAPP', btn: 'HAMBURG JOBS' },
  { r1: 'STUDENT IN', r2: 'MÜNCHEN?', sub: 'FAIRE JOBS IN SCHWABING & CO.', tags: 'GUTE BEZAHLUNG   |   KEINE HÜRDEN   |   JOBROOFS', btn: 'MÜNCHEN GIGS' },
  { r1: 'STUDENT IN', r2: 'KÖLN?', sub: 'VEEDEL-JOBS IN EHRENFELD & SÜD.', tags: 'GASTRO & HANDWERK   |   1-KLICK CHAT   |   JOBROOFS', btn: 'KÖLN JOBS' },
  { r1: 'STUDENT IN', r2: 'FRANKFURT?', sub: 'GIGS IN BOCKENHEIM & NORDEND.', tags: 'FLEXIBLE ZEITEN   |   DIREKTER DRAHT   |   JOBROOFS', btn: 'FRANKFURT GIGS' },
  { r1: 'WILLST DU FLEXIBLE', r2: 'ARBEITSZEITEN?', sub: 'DEIN ZEITPLAN. DEINE REGELN.', tags: 'TEILZEIT & MINIJOB   |   VOLLE TRANSPARENZ   |   JOBROOFS', btn: 'FLEXIBEL ARBEITEN' },
  { r1: 'VERDIENE EXTRA', r2: 'GELD.', sub: 'FÜR DEN URLAUB ODER NEBENBEI.', tags: 'FAIRE STUNDENLÖHNE   |   KEINE VERMITTLER   |   DIREKT', btn: 'NEBENVERDIENST FINDEN' }
];

const MORE_GERMAN_SEEKERS = [
  ['SUCHST DU EINEN', 'CAFÉ JOB?', 'Barista & Service in Kiez-Cafés'],
  ['SUCHST DU EINEN', 'BAR JOB?', 'Nachtleben, faire Schichten, gutes Trinkgeld'],
  ['WILLST DU EINEN JOB', 'UM DIE ECKE?', 'In 15 Minuten zu Fuß zur Arbeit'],
  ['FAHRER JOB', 'GESUCHT?', 'Kurierfahrten & Lieferdienste ohne Zeitarbeit'],
  ['KÜCHENJOB', 'IN DEINER NÄHE?', 'Familiäre Küchenteams ohne Bürokratie'],
  ['FRÜHSCHICHTEN', 'BEVORZUGT?', 'Arbeiten von 6 bis 12 Uhr. Nachmittag frei.'],
  ['ABENDSCHICHTEN', 'GESUCHT?', 'Gastro & Bar ab 18 Uhr neben dem Studium'],
  ['FERIENJOB', 'GESUCHT?', 'Saisonjobs & Aushilfen im Sommer'],
  ['EVENT JOB', 'IN DEINER STADT?', 'Konzerte, Festivals & Messen'],
  ['VERKAUFSJOB', 'IN DEINEM KIEZ?', 'Boutiquen, Concept Stores & Shops'],
  ['KEINE ERFAHRUNG?', 'KEIN PROBLEM.', 'Zuverlässigkeit & Freundlichkeit reichen'],
  ['AB 18 &', 'BEREIT ZUM ARBEITEN?', 'Dein unkomplizierter Einstieg ins Arbeitsleben'],
  ['SCHNELLES GELD', 'NEBENBEI?', 'Minijobs in ganz Deutschland ohne Zwischenhändler'],
  ['REINIGUNGSJOB', 'GESUCHT?', 'Feste Schichten, pünktliches Geld, kein Stress'],
  ['CREW & BÜHNENJOB', 'GESUCHT?', 'Backstage, Aufbau & Crew Life']
];

MORE_GERMAN_SEEKERS.forEach(([r1, r2, sub]) => {
  GERMAN_SEEKER_POSTS.push({
    r1,
    r2,
    sub,
    tags: '1-KLICK WHATSAPP   |   0% ZEITARBEIT   |   JOBROOFS',
    btn: 'GIG JETZT FINDEN'
  });
});

/**
 * 12 GERMAN MANIFESTO RULES
 */
const GERMAN_MANIFESTO_RULES = [
  { r1: 'REGEL #1:', r2: '0% ZEITARBEIT.', sub: 'PARASITÄRE MODELLE HABEN HIER KEINEN PLATZ.', btn: 'UNSER MANIFEST' },
  { r1: 'REGEL #2:', r2: '1. POST IST GRATIS.', sub: 'NULL FINANZIELLES RISIKO FÜR INHABER.', btn: 'KOSTENLOS STARTEN' },
  { r1: 'REGEL #3:', r2: 'SPEED GEWINNT.', sub: 'DER SCHNELLSTE PROZESS MACHT DAS RENNEN.', btn: 'SCHNELL BESETZEN' },
  { r1: 'REGEL #4:', r2: 'NULL REIBUNG.', sub: 'WENN ES 5 KLICKS DAUERT, IST ES KAPUTT.', btn: '1-KLICK STANDARD' },
  { r1: 'REGEL #5:', r2: 'LOHN AB MINUTE 1.', sub: 'UNBEZAHLTE ARBEIT SCHAFFT SCHLECHTE ARBEIT.', btn: 'FAIRNESS FIRST' },
  { r1: 'REGEL #6:', r2: 'STUNDENLOHN OFFEN.', sub: 'GEHEIMNISSE VERTREIBEN DIE BESTEN LEUTE.', btn: 'TRANSPARENZ' },
  { r1: 'REGEL #7:', r2: 'MUT ZUR KANTE.', sub: 'LANGWEILIG SEIN IST DAS GRÖSSTE RISIKO.', btn: 'STANDPUNKT ZEIGEN' },
  { r1: 'REGEL #8:', r2: 'KIEZ VOR KONZERN.', sub: 'UNTERSTÜTZE DIE LOKALEN MACHER.', btn: 'LOKAL DENKEN' },
  { r1: 'REGEL #9:', r2: 'KEINE ABO-FALLEN.', sub: 'EHRLICHE BETRIEBE BRAUCHEN KEINE KNEBEL-ABOS.', btn: 'JOBROOFS.COM' },
  { r1: 'REGEL #10:', r2: 'CHARAKTER ZÄHLT.', sub: 'TRAINIERE DAS KÖNNEN. STELLE DEN MENSCHEN EIN.', btn: 'MENSCHLICH BLEIBEN' },
  { r1: 'REGEL #11:', r2: 'WHATSAPP GEWINNT.', sub: 'TRIFF BEWERBER DORT, WO SIE TATSÄCHLICH SIND.', btn: 'DIREKTER DRAHT' },
  { r1: 'REGEL #12:', r2: 'LIEFERE DAS ERGEBNIS.', sub: 'BESETZE DIE SCHICHT. PUNKT.', btn: 'ERGEBNIS ZÄHLT' }
];

/**
 * 10 GERMAN KIEZ POSTS
 */
const GERMAN_KIEZ_POSTS = [
  { r1: 'BERLIN', r2: 'BETRIEBE.', sub: 'HÖRT AUF, 500 € FÜR ANZEIGEN ZU ZAHLEN.', btn: 'BERLIN KIEZ JOBS' },
  { r1: 'HAMBURG', r2: 'MACHER.', sub: 'FINDE TALENTE, DIE AN DEINEM LADEN VORBEIGEHEN.', btn: 'HAMBURG JOBS' },
  { r1: 'MÜNCHEN', r2: 'GASTRONOMEN.', sub: 'FAIRE SCHICHTEN. WHATSAPP DIREKT. 0% GEBÜHREN.', btn: 'MÜNCHEN GIGS' },
  { r1: 'KÖLN', r2: 'VEEDEL.', sub: 'UNTERSTÜTZE LOKALES HANDWERK & GASTRO.', btn: 'KÖLN VEEDEL' },
  { r1: 'FRANKFURT', r2: 'BETRIEBE.', sub: 'SCHICHTEN SCHNELL BESETZEN IN DER METROPOLE.', btn: 'FRANKFURT JOBS' },
  { r1: 'LEIPZIG', r2: 'SZENE.', sub: 'MINIJOBS & ATELIER-GIGS AUF ABRUF.', btn: 'LEIPZIG JOBS' },
  { r1: 'STUTTGART', r2: 'SCHAFFEND.', sub: 'HANDWERK & GASTRO OHNE PAPIERKRIEG.', btn: 'STUTTGART JOBS' },
  { r1: 'DÜSSELDORF', r2: 'KIEZE.', sub: 'BOUTIQUE-RECRUITING IN 2 MINUTEN.', btn: 'DÜSSELDORF JOBS' },
  { r1: 'BREMEN', r2: 'VIERTEL.', sub: 'HANSEATISCH EHRLICH. ZERO BULLSHIT.', btn: 'BREMEN VIERTEL' },
  { r1: 'DRESDEN', r2: 'NEUSTADT.', sub: 'LOKALE STELLENANZEIGEN FÜR ALLE BETRIEBE.', btn: 'DRESDEN JOBS' }
];

// Combine into 102 German-native posts across 34 days
const allScheduledPosts = [];
let empIdx = 0;
let conIdx = 0;
let seekIdx = 0;
let ruleIdx = 0;
let kiezIdx = 0;

for (let day = 1; day <= 34; day++) {
  // Morning Slot (08:30): German Hormozi Grand Slam Employer Offer
  const emp = GERMAN_EMPLOYER_POSTS[empIdx++ % GERMAN_EMPLOYER_POSTS.length];
  const color1 = paletteKeys[(day * 3) % paletteKeys.length];

  allScheduledPosts.push({
    id: (day - 1) * 3 + 1,
    day,
    slot: 'morning',
    time: '08:30 CET',
    pillar: 'employer',
    role1: emp.r1,
    role2: emp.r2,
    subline: emp.sub,
    tags: emp.tags,
    buttonText: emp.btn || 'JETZT KOSTENLOS INSERIEREN',
    colorway: color1,
    palette: PALETTES[color1],
    germanCaption: `${emp.r1} ${emp.r2} Inseriere auf JOBROOFS. 🏢⚡\n\n${emp.hook}\n\n${emp.pain}\n\n${emp.math}\n\n${emp.offer}\n\n👉 Jetzt in 2 Minuten kostenlos online gehen: jobroofs.com/post-a-job (Link in Bio)\n\n#recruiting #mitarbeitersuche #stellenanzeige #unternehmer #arbeitgeber #mittelstand #handwerk #gastronomie #jobroofs #unternehmertum #hiringhacks`
  });

  // Midday Slot (13:00): German Contrarian Truth Bomb / Rule
  const isRule = (day % 3 === 0);
  const midItem = isRule
    ? GERMAN_MANIFESTO_RULES[ruleIdx++ % GERMAN_MANIFESTO_RULES.length]
    : GERMAN_CONTRARIAN_POSTS[conIdx++ % GERMAN_CONTRARIAN_POSTS.length];
  const color2 = paletteKeys[(day * 3 + 1) % paletteKeys.length];

  const midCaption = isRule
    ? `${midItem.r1} ${midItem.r2} 🛑\n\n${midItem.sub}\n\nWarum dieser Grundsatz unantastbar ist:\nDie meisten Unternehmen scheitern beim Hiring nicht am Markt, sondern an ihren eigenen Reibungsverlusten.\n\nWer 2026 noch Reibung erzeugt, verliert die besten Leute an Betriebe, die schnell und direkt sind.\n\nJOBROOFS Standard:\n✓ 0 € Erstinserat\n✓ 1-Klick WhatsApp Direktkontakt\n✓ 0% Zeitarbeit\n\n👉 Werde Teil der neuen Bewegung: jobroofs.com (Link in Bio)\n\n#unternehmertum #businessrules #hormozi #jobroofs #recruitingwahrheit #arbeitgeber #mittelstand`
    : `${midItem.r1} ${midItem.r2} 🛑\n\n${midItem.hook}\n\n${midItem.body}\n\n${midItem.offer}\n\n#recruitingtipps #stepstone #indeed #jobportal #unternehmer #wirtschaft #fachkräftemangel #jobroofs`;

  allScheduledPosts.push({
    id: (day - 1) * 3 + 2,
    day,
    slot: 'midday',
    time: '13:00 CET',
    pillar: isRule ? 'manifesto' : 'contrarian',
    role1: midItem.r1,
    role2: midItem.r2,
    subline: midItem.sub,
    tags: midItem.tags || 'KLARTEXT   |   VALUE EQUATION   |   JOBROOFS',
    buttonText: midItem.btn || 'JOBROOFS.COM',
    colorway: color2,
    palette: PALETTES[color2],
    germanCaption: midCaption
  });

  // Evening Slot (19:30): German Operator & Seeker / Kiez Hook
  const isKiez = (day % 4 === 0);
  const eveItem = isKiez
    ? GERMAN_KIEZ_POSTS[kiezIdx++ % GERMAN_KIEZ_POSTS.length]
    : GERMAN_SEEKER_POSTS[seekIdx++ % GERMAN_SEEKER_POSTS.length];
  const color3 = paletteKeys[(day * 3 + 2) % paletteKeys.length];

  allScheduledPosts.push({
    id: (day - 1) * 3 + 3,
    day,
    slot: 'evening',
    time: '19:30 CET',
    pillar: isKiez ? 'kiez' : 'seeker',
    role1: eveItem.r1,
    role2: eveItem.r2,
    subline: eveItem.sub,
    tags: eveItem.tags || '1-KLICK WHATSAPP   |   0% ZEITARBEIT   |   JOBROOFS',
    buttonText: eveItem.btn || 'FINDE DEINEN GIG',
    colorway: color3,
    palette: PALETTES[color3],
    germanCaption: `${eveItem.r1} ${eveItem.r2} ⚡\n\n${eveItem.sub}\n\nWarum für Zwischenhändler schwitzen, wenn du direkt beim Inhaber arbeiten kannst?\n\nAuf JOBROOFS bewirbst du dich so einfach wie eine WhatsApp-Nachricht an einen Freund:\n✓ Stundenlohn ab Minute 1 transparent auf dem Schirm\n✓ Kein Anschreiben, kein Lebenslauf-Papierkrieg\n✓ 0% Zeitarbeits-Abzocke\n\n👉 Finde deinen nächsten Kiez-Gig heute Abend: jobroofs.com (Link in Bio)\n\n#minijob #nebenjob #studentenjob #gastrojobs #kiezjobs #jobroofs #geldverdienen #deutschlandjobs`
  });
}

const dest = path.join(dataDir, 'campaign-100-posts.json');
fs.writeFileSync(dest, JSON.stringify(allScheduledPosts, null, 2));
console.log(`🇩🇪 GERMAN HORMOZI STANDARD APPLIED! Successfully wrote ${allScheduledPosts.length} posts to ${dest}`);
