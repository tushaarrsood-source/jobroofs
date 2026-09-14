const fs = require('fs');
const path = require('path');
const { generateHashtagsForPost, formatCaptionWithHashtags } = require('./hashtag-matrix');

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
  espresso: { bg: '#2B1810', text: '#F5EBE1', name: 'Espresso Dark & Oat Cream' },
  indigo: { bg: '#1E1B4B', text: '#EEF2FF', name: 'Deep Imperial Indigo & Cloud' },
};

const paletteKeys = Object.keys(PALETTES);

// 1. SLOT 1: MORNING SEEKER & OPERATOR HOOKS (07:30 CET)
const SEEKER_HOOKS = [
  {
    r1: 'MINIJOB BIS 603 €',
    r2: 'BRUTTO = NETTO.',
    sub: 'KEINE ABZÜGE. KEINE AGENTUR.',
    tags: '100% BEHALTEN   |   1-KLICK BEWERBUNG   |   JOBROOFS',
    btn: 'FINDE DEINEN MINIJOB',
    hook: 'Wusstest du, dass du beim 603-Euro-Minijob exakt null Euro Steuern und Sozialabgaben zahlst?',
    body: 'Der Staat lässt dir jeden einzelnen Cent. Aber viele lassen sich von Zeitarbeitsfirmen vermitteln, die sich heimlich 30% von deiner Arbeitsleistung abschneiden.\n\nArbeite direkt für den Inhaber. Kein Vermittler, keine Abzüge, 1-Klick WhatsApp.',
    cta: 'Finde deinen Minijob heute: jobroofs.com'
  },
  {
    r1: 'KEIN LEBENSLAUF?',
    r2: 'KEIN PROBLEM.',
    sub: 'DEINE ARBEIT ZÄHLT. NICHT DEIN PDF.',
    tags: 'ZERO BULLSHIT   |   DIREKTKONTAKT   |   JOBROOFS',
    btn: 'OHNE PDF BEWERBEN',
    hook: 'Wer braucht ein 3-seitiges Anschreiben, um festzustellen, ob du zuverlässig kochen, servieren oder fahren kannst?',
    body: 'Niemand. Die besten Arbeitgeber wollen sehen, wer du bist und wie du anpackst – nicht wie gut du Word-Vorlagen formatieren kannst.\n\nAuf JOBROOFS bewirbst du dich per WhatsApp in 60 Sekunden.',
    cta: 'Direkt bewerben auf jobroofs.com'
  },
  {
    r1: '16,50 € / STD.',
    r2: 'MINDESTENS.',
    sub: 'UNTER WERT ARBEITEN WAR GESTERN.',
    tags: 'FAIRE LÖHNE   |   TRANSPARENZ   |   JOBROOFS',
    btn: 'GIGS MIT TOP-LOHN',
    hook: 'Warum verschweigen alte Jobportale den Stundenlohn bis zum Vorstellungsgespräch?',
    body: 'Weil sie hoffen, dich im Gespräch runterzuhandeln. Wir machen das Spiel nicht mit.\n\nAuf JOBROOFS steht der Stundenlohn groß und fett in jedem Inserat. Bevor du auch nur ein Wort schreibst.',
    cta: 'Sieh alle Stundenlöhne auf jobroofs.com'
  },
  {
    r1: 'STUDENTENJOB',
    r2: 'OHNE KNEBELVERTRAG.',
    sub: 'DEINE PRÜFUNGEN GEHEN VOR.',
    tags: 'FLEXIBLE SCHICHTEN   |   KIEZ-GIGS   |   JOBROOFS',
    btn: 'STUDI-JOBS ENTDECKEN',
    hook: 'Du kannst nicht 20 Stunden in der Klausurenphase schuften. Das muss dein Chef kapieren.',
    body: 'Auf JOBROOFS findest du Gastronomen und Kiez-Betriebe, die flexible Schichten anbieten. Passe deine Arbeit an dein Semester an, nicht umgekehrt.',
    cta: 'Finde Studi-Jobs auf jobroofs.com'
  },
  {
    r1: 'SCHICHTEN TAUSCHEN',
    r2: 'PER WHATSAPP.',
    sub: 'SO FUNKTIONIERT ARBEIT 2026.',
    tags: 'DIREKTER DRAHT   |   MODERNES HIRING   |   JOBROOFS',
    btn: 'DIREKTKONTAKT STARTEN',
    hook: 'Kein Intranet aus den 90ern. Kein verstaubter Dienstplan am Schwarzen Brett.',
    body: 'Direkte Kommunikation mit deinem Schichtleiter über WhatsApp. Schnell, unkompliziert, menschlich.',
    cta: 'Entdecke moderne Betriebe auf jobroofs.com'
  },
  {
    r1: 'WOCHENENDE',
    r2: 'CASH VERDIENEN.',
    sub: 'SAMSTAG ANPACKEN, SONNTAG ABKASSIEREN.',
    tags: 'EVENT-GIGS   |   SCHNELLE AUSZAHLUNG   |   JOBROOFS',
    btn: 'EVENT-GIGS ANSEHEN',
    hook: 'Brauchst du diesen Monat 400 € extra auf dem Konto?',
    body: 'Schnapp dir 2 Wochenendschichten im Eventbereich oder in der Gastro. Auf JOBROOFS findest du kurzfristige Einsätze ohne bürokratische Hürden.',
    cta: 'Jetzt Nebenjob finden: jobroofs.com'
  },
  {
    r1: 'BARISTA SKILLS?',
    r2: 'HIER GIBT ES CASH.',
    sub: 'SPECIALTY CAFÉS SUCHEN DICH.',
    tags: 'KAFFEE-KULTUR   |   TRINKGELD ON TOP   |   JOBROOFS',
    btn: 'BARISTA-STELLEN FINDEN',
    hook: 'Gute Baristas sind die Rockstars der Berliner Kieze. Lass dich nicht mit Mindestlohn abspeisen.',
    body: 'Finde Betriebe mit ordentlichem Basishonorar und echtem Team-Trinkgeld. Schreib direkt dem Inhaber.',
    cta: 'Zu den Barista-Gigs: jobroofs.com'
  },
  {
    r1: 'FAHRER & KURIER',
    r2: 'IN DEINEM BEZIRK.',
    sub: 'KEINE 45 MINUTEN ANFAHRT MEHR.',
    tags: 'NAH DRAN   |   KEIN VERKEHRSSTAU   |   JOBROOFS',
    btn: 'JOBS IN DER NÄHE',
    hook: 'Warum jeden Tag 90 Minuten in der Bahn verbringen, nur um zur Arbeit zu kommen?',
    body: 'Finde Fahrer- und Liefer-Jobs direkt in deinem Bezirk. Spare Zeit, schone deine Nerven, verdiene mehr pro Stunde effektiv.',
    cta: 'Finde Jobs in deinem Kiez: jobroofs.com'
  },
  {
    r1: 'TEILZEIT MIT SINN',
    r2: 'UND RESPEKT.',
    sub: 'ARBEITE IN BETRIEBEN DIE DICH SCHÄTZEN.',
    tags: 'ECHTE TEAMS   |   FAIRE CHEFS   |   JOBROOFS',
    btn: 'TEILZEIT ENTDECKEN',
    hook: 'Ein Job ist mehr als Geld: Es ist die Atmosphäre, in der du 20 Stunden deiner Woche verbringst.',
    body: 'JOBROOFS listet unabhängige Betriebe – Cafés, Werkstätten, Kiez-Läden. Keine anonymen Großkonzern-Nummern.',
    cta: 'Finde faire Arbeitgeber: jobroofs.com'
  },
  {
    r1: 'AUSHILFE GESUCHT?',
    r2: 'SEI DIE ANTWORT.',
    sub: 'VIELE BETRIEBE BRAUCHEN DICH HEUTE.',
    tags: 'SOFORT-START   |   KEINE WARTEZEIT   |   JOBROOFS',
    btn: 'HEUTE NOCH STARTEN',
    hook: 'Viele Betriebe suchen nicht jemanden für nächsten Monat. Sie brauchen dich ab morgen.',
    body: 'Schreib eine kurze Nachricht auf WhatsApp. Mach einen Probetag. Fang an.',
    cta: 'Gigs ab sofort auf jobroofs.com'
  }
];

// 2. SLOT 2: MIDDAY EMPLOYER WAKE-UP CALLS (11:30 CET)
const EMPLOYER_HOOKS = [
  {
    r1: 'AUSHILFE',
    r2: 'GESUCHT?',
    sub: 'SCHLUSS MIT 500 € FÜR STELLENANZEIGEN.',
    tags: '0 € ERSTINSERAT   |   1-KLICK WHATSAPP   |   0% ZEITARBEIT',
    btn: 'JETZT KOSTENLOS INSERIEREN',
    hook: 'Warum zahlen Betriebe 2026 immer noch 499 € für ein einziges Inserat, nur um dann geghostet zu werden?',
    pain: 'Hier ist die brutale Mathematik: Du gibst 500 € bei StepStone aus. 73% der Bewerber brechen ab, weil sie ein 4-seitiges PDF hochladen müssen. Am Ende hast du 0 Mitarbeiter und 500 € verbrannt.',
    math: 'Der Hormozi-Standard für Hiring heißt: Reibung auf null senken. Der Bewerber schreibt dir direkt per WhatsApp. Keine Agentur dazwischen.',
    offer: 'Unser Grand Slam Offer: Dein 1. Inserat kostet 0 €. Keine Kreditkarte, kein Abo. Wer jetzt nein sagt, hasst Geld.'
  },
  {
    r1: 'BARISTA',
    r2: 'GESUCHT?',
    sub: 'DEINE SCHICHTEN SIND NICHT GRUNDLOS LEER.',
    tags: 'WHATSAPP DIREKT   |   0 € ANZEIGE   |   SCHNELLES HIRING',
    btn: 'JETZT STELLE SCHALTEN',
    hook: 'Wenn dein Café keine Baristas findet, liegt es nicht am Fachkräftemangel. Es liegt an deinem 12-Schritte-Bewerbungsprozess.',
    pain: 'Niemand unter 30 füllt für einen 16-Euro-Job ein Online-Formular mit Lebenslauf-Upload aus. Talent will wissen: Was ist der Stundenlohn? Wo ist der Laden? Wann geht es los?',
    math: 'Je schneller der Kontakt, desto höher die Abschlussquote. Bei Jobroofs schreibt dir der Barista mit 1 Klick per WhatsApp.',
    offer: 'Schalte deine offene Schicht jetzt kostenlos online. In 120 Sekunden live auf jobroofs.com/post-a-job.'
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
    r1: 'FAHRER',
    r2: 'GESUCHT?',
    sub: 'AGENTUREN KASSIEREN 30%. WIR 0%.',
    tags: 'KEINE VERMITTLER   |   100% DIREKT   |   0 € RISIKO',
    btn: 'JETZT INSERIEREN',
    hook: 'Zeitarbeitsfirmen kassieren 30% bis 40% Marge auf jede Stunde, die dein Fahrer schwitzt. Für eine Excel-Tabelle.',
    pain: 'Das ist kein Business-Service. Das ist ein Parasitenmodell. Schneide den Zwischenhändler raus.',
    math: 'Fahrer wollen einen fairen Lohn und direkten Kontakt zum Chef. Unternehmen wollen Zuverlässigkeit und keine Knebelverträge.',
    offer: 'Inseriere deinen Fahrer-Job heute zu 100% kostenlos auf JOBROOFS. Direktkontakt auf dein Handy.'
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
    r1: 'LAGERHELFER',
    r2: 'GESUCHT?',
    sub: 'PACKEN STATT PAPIERKRAM.',
    tags: 'DIREKT VERFÜGBAR   |   LOGISTIK-GIGS   |   JOBROOFS',
    btn: 'JETZT BESETZEN',
    hook: 'Deine Pakete stapeln sich und Zeitarbeitsfirmen vertrösten dich auf nächste Woche?',
    pain: 'Die Vermittler schicken dir Leute, die keine Lust haben und kassieren das Doppelte.',
    math: 'Hol dir motivierte Kräfte aus der Region über Direktkontakt.',
    offer: '1. Inserat gratis auf jobroofs.com/post-a-job.'
  },
  {
    r1: 'EVENT-AUSHILFE',
    r2: 'GESUCHT?',
    sub: 'DAS WOCHENENDE STEHT VOR DER TÜR.',
    tags: 'FLEXIBEL   |   SCHNELL   |   0 € KOSTEN',
    btn: 'EVENT-GIG SCHALTEN',
    hook: 'Freitagabend 200 Gäste und 3 Leute melden sich krank?',
    pain: 'Jetzt brauchst du keinen Headhunter, sondern einen schnellen Kanal zu Leuten, die heute Geld verdienen wollen.',
    math: '1 Klick auf JOBROOFS = Reichweite im Kiez.',
    offer: 'Stelle in 2 Minuten online stellen: jobroofs.com.'
  },
  {
    r1: 'STORE-MANAGER',
    r2: 'GESUCHT?',
    sub: 'VERANTWORTUNG IM KIEZ-LADEN.',
    tags: 'FÜHRUNG   |   UNABHÄNGIG   |   JOBROOFS',
    btn: 'TALENT FINDEN',
    hook: 'Gute Schichtleiter wachsen nicht auf Bäumen – sie arbeiten gerade bei deinem Konkurrenten und sind unzufrieden.',
    pain: 'Zeig ihnen, was du bietest: faire Führung, transparente Bezahlung, echte Wertschätzung.',
    math: 'Direktkontakt bricht Barrieren.',
    offer: 'Inseriere deine Schlüsselstelle auf jobroofs.com.'
  }
];

// 3. SLOT 3: AFTERNOON HORMOZI CONTRARIAN TRUTHS (14:30 CET)
const CONTRARIAN_HOOKS = [
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
    r1: 'DER VALUE EQUATION',
    r2: 'FÜRS RECRUITING.',
    sub: 'HORMOZI-MATH FÜR MITARBEITERSUCHE.',
    tags: 'TRAUM-ERGEBNIS   |   ZEIT-VERZÖGERUNG = NULL   |   JOBROOFS',
    btn: 'DAS REZEPT VERSTEHEN',
    hook: 'Die Hormozi Value Equation: Wert = (Traumergebnis × Wahrscheinlichkeit) ÷ (Zeitverzögerung × Anstrengung).',
    body: 'Wenn du Zeitverzögerung (3 Wochen) und Anstrengung (PDF-Upload) auf null senkst, schießt der Wert deines Jobangebots durch die Decke.\n\nDeshalb funktioniert 1-Klick WhatsApp auf JOBROOFS.',
    offer: 'Senke Reibung auf null: jobroofs.com'
  },
  {
    r1: 'WER BILLIG ZAHLT,',
    r2: 'ZAHLT DREIFACH.',
    sub: 'UNBESETZTE SCHICHTEN KOSTEN TAUSENDE.',
    tags: 'OPPORTUNITÄTSKOSTEN   |   HIRE SMART   |   JOBROOFS',
    btn: 'RICHTIG RECHNEN',
    hook: 'Du sparst 2 Euro beim Stundenlohn und verlierst 1.500 Euro Umsatz, weil du Tische nicht besetzen kannst?',
    body: 'Das ist keine Sparsamkeit. Das ist schlechtes Rechnen. Zahle 1 Euro über Kiez-Durchschnitt und deine Personalprobleme sind Geschichte.',
    offer: 'Finde Top-Leute auf jobroofs.com'
  },
  {
    r1: 'ANSCHREIBEN SIND',
    r2: 'REINE FANTASIE.',
    sub: 'TESTE LEISTUNG, NICHT CHATGPT.',
    tags: 'PROBETAG STATT PDF   |   PRAXIS ZÄHLT   |   JOBROOFS',
    btn: 'PRAXIS-CHECK STARTEN',
    hook: 'Jedes Anschreiben 2026 wurde von ChatGPT in 12 Sekunden generiert.',
    body: 'Warum liest du noch Textbausteine? Lade den Bewerber für 2 Stunden ein. Schau, wie er Gäste begrüßt und anpackt.',
    offer: 'Finde echte Macher auf jobroofs.com'
  }
];

// 4. SLOT 4: EVENING KIEZ & DISTRICT SPOTLIGHTS (18:00 CET)
const KIEZ_HOOKS = [
  {
    r1: 'MITTE, BERLIN.',
    r2: 'DEINE SCHICHT WARTET.',
    sub: 'CAFÉS, RESTAURANTS & KIEZ-GIGS.',
    tags: 'TORSTRASSE   |   ROSENTHALER   |   JOBROOFS',
    btn: 'GIGS IN MITTE FINDEN',
    hook: 'Mitte schläft nie – und sucht immer gute Leute an Siebträger und Bar.',
    body: 'Finde Jobs direkt um die Ecke vom Rosenthaler Platz oder Hackeschen Markt. 0 Minuten verlorene Zeit.',
    offer: 'Entdecke Mitte-Gigs: jobroofs.com'
  },
  {
    r1: 'KREUZBERG 36.',
    r2: 'ECHTE ARBEIT, ECHTE LEUTE.',
    sub: 'KEINE BÜROKRATIE AM KOTTI.',
    tags: 'ORANIENSTRASSE   |   WRANGELKIEZ   |   JOBROOFS',
    btn: 'KREUZBERG GIGS',
    hook: 'Kreuzberg funktioniert über Beziehungen, Vertrauen und Handschlag.',
    body: 'Triff Gastronomen und Ladenbesitzer auf Augenhöhe. Schreib ihnen direkt per WhatsApp.',
    offer: 'Kreuzberg Jobs auf jobroofs.com'
  },
  {
    r1: 'NEUKÖLLN PULSIERT.',
    r2: 'HIRE HEUTE ABEND.',
    sub: 'WESERSTRASSE & PANNIERKIEZ.',
    tags: 'BARS   |   KUNST   |   EVENT   |   JOBROOFS',
    btn: 'NEUKÖLLN JOBS',
    hook: 'Zwischen Sonnenallee und Maybachufer entstehen jeden Monat neue Hotspots.',
    body: 'Sichere dir Jobs in den angesagtesten Bars und Cafés ohne Agentur-Umwege.',
    offer: 'Neukölln Gigs auf jobroofs.com'
  },
  {
    r1: 'PRENZLAUER BERG.',
    r2: 'VOM KASTANIEN- BIS HELMHOLTZPLATZ.',
    sub: 'FAMILIÄRE TEAMS, GUTER STUNDENLOHN.',
    tags: 'SPECIALTY FOOD   |   BOUTIQUEN   |   JOBROOFS',
    btn: 'PRENZLBERG GIGS',
    hook: 'Im Prenzlberg schätzen Betriebe Zuverlässigkeit und freundlichen Service.',
    body: 'Finde feste Schichten oder flexible Minijobs bei inhabergeführten Unternehmen.',
    offer: 'Prenzlauer Berg Jobs: jobroofs.com'
  },
  {
    r1: 'FRIEDRICHSHAIN.',
    r2: 'BOXHAGENER KIEZ.',
    sub: 'LEBEN WO ANDERE FEIERND VORBEILAUFEN.',
    tags: 'SIMON-DACH   |   WARSCHAUER   |   JOBROOFS',
    btn: 'F-HAIN JOBS',
    hook: 'Wochenend-Gigs und Bar-Schichten rund um den Boxi.',
    body: 'Bewirb dich direkt bei Barchefs und Restaurantleitern per WhatsApp.',
    offer: 'Friedrichshain Gigs auf jobroofs.com'
  },
  {
    r1: 'HAMBURG SCHANZE.',
    r2: 'NORDISCH DIREKT.',
    sub: 'GASTRO & EVENTS AN DER ELBE.',
    tags: 'SCHANZENVIERTEL   |   ST. PAULI   |   JOBROOFS',
    btn: 'HAMBURG JOBS',
    hook: 'Moin Moin statt Motivationsschreiben.',
    body: 'In Hamburg zählen Verlässlichkeit und Klartext. Finde Jobs direkt im Schanzenviertel und auf St. Pauli.',
    offer: 'Hamburg Jobs auf jobroofs.com'
  },
  {
    r1: 'MÜNCHEN SCHWABING.',
    r2: 'TOP-LÖHNE, KLARE REGELN.',
    sub: 'PREMIUM SERVICE & BOUTIQUE GIGS.',
    tags: 'LEOPOLDSTRASSE   |   GÄRTNERPLATZ   |   JOBROOFS',
    btn: 'MÜNCHEN JOBS',
    hook: 'München zahlt Top-Stundenlöhne für engagierte Service- und Bar-Profis.',
    body: 'Finde Jobs ab 18 € / Std. bei renommierten Betrieben ohne Zeitarbeits-Abzug.',
    offer: 'München Jobs auf jobroofs.com'
  },
  {
    r1: 'KÖLN EHRENFELD.',
    r2: 'KÖLSCHE HERZLICHKEIT.',
    sub: 'VENLOER STRASSE & BELGISCHES VIERTEL.',
    tags: 'VEEDEL-POWER   |   GASTRO   |   JOBROOFS',
    btn: 'KÖLN JOBS',
    hook: 'Im Veedel kennt man sich – und stellt direkt ein.',
    body: 'Keine Konzern-Formalitäten. Schreib dem Wirt auf WhatsApp und starte morgen.',
    offer: 'Köln Veedel-Jobs auf jobroofs.com'
  },
  {
    r1: 'CHARLOTTENBURG.',
    r2: 'KU’DAMM BIS KANTSTRASSE.',
    sub: 'TRADITION TRIFFT MODERNE GASTRO.',
    tags: 'SAVIGNYPLATZ   |   HOTEL   |   JOBROOFS',
    btn: 'WEST-BERLIN GIGS',
    hook: 'Von der Kantstraße bis zum Savignyplatz: Hohe Nachfrage nach zuverlässigem Servicepersonal.',
    body: 'Finde krisensichere Jobs in etablierten Betrieben mit fairem Trinkgeld.',
    offer: 'Charlottenburg Jobs auf jobroofs.com'
  },
  {
    r1: 'FRANKFURT SACHSENHAUSEN.',
    r2: 'VOM MAIN BIS ZUR BÖRSE.',
    sub: 'SCHNELLE JOBS IN DER METROPOLE.',
    tags: 'RHEIN-MAIN   |   BARS   |   JOBROOFS',
    btn: 'FRANKFURT JOBS',
    hook: 'Frankfurt bewegt sich im Sekundentakt. Recruiting muss genauso schnell sein.',
    body: 'Finde Aushilfs- und Bar-Gigs direkt in Sachsenhausen und Bornheim.',
    offer: 'Frankfurt Jobs auf jobroofs.com'
  }
];

// 5. SLOT 5: LATE NIGHT MANIFESTO (21:00 CET)
const MANIFESTO_RULES = [
  {
    r1: 'RULE #1:',
    r2: 'ZERO BULLSHIT.',
    sub: 'KEINE ZEITARBEIT. KEINE AGENTUREN.',
    tags: '100% UNABHÄNGIG   |   DER NEUE STANDARD   |   JOBROOFS',
    btn: 'UNSERE REGELN',
    hook: 'Regel #1 bei JOBROOFS: Wir listen keine Zeitarbeitsfirmen. Niemals.',
    body: 'Wir glauben an die direkte Verbindung zwischen dem Menschen, der das Risiko trägt (Inhaber), und dem Menschen, der die Arbeit macht (Mitarbeiter).\n\nKein Zwischenhändler schneidet sich 30% aus der harten Arbeit deines Teams.',
    offer: 'Werde Teil der Bewegung: jobroofs.com'
  },
  {
    r1: 'RULE #2:',
    r2: 'SPEED IS KING.',
    sub: 'WER ZUERST ANTWORTET, GEWINNT.',
    tags: '1-KLICK WHATSAPP   |   ANTWORT IN MINUTEN   |   JOBROOFS',
    btn: 'SPEED RECRUITING',
    hook: 'Im Jahr 2026 wartet niemand 14 Tage auf eine Antwort von HR.',
    body: 'Wenn du Talent willst, musst du in 2 Stunden antworten. Deshalb leitet JOBROOFS Bewerber direkt in deinen WhatsApp-Chat.\n\nKein Login, kein Dashboard, kein Umweg.',
    offer: 'Rekrutiere mit Lichtgeschwindigkeit: jobroofs.com'
  },
  {
    r1: 'RULE #3:',
    r2: 'LOOT AT FIRST SIGHT.',
    sub: 'KEIN GEHEIMNIS UM DEN STUNDENLOHN.',
    tags: 'TRANSPARENZ   |   RESPEKT   |   JOBROOFS',
    btn: 'TRANSPARENT INSERIEREN',
    hook: 'Transparenz ist kein Extra. Es ist die Grundvoraussetzung für Respekt.',
    body: 'Nenne die Zahl. Stundenlohn, Trinkgeld-Schnitt, Schichten. Wer die Fakten verschweigt, hat etwas zu verbergen.\n\nBetriebe auf JOBROOFS stehen zu ihren Konditionen.',
    offer: 'Schalte transparente Jobs: jobroofs.com'
  },
  {
    r1: 'RULE #4:',
    r2: 'DAS GRAND SLAM OFFER.',
    sub: 'SO GUT, DASS MAN SICH DUMM FÜHLT NEIN ZU SAGEN.',
    tags: '0 € RISIKO   |   0 € ERSTINSERAT   |   ALEX HORMOZI',
    btn: '0 € ANGEBOT SICHERN',
    hook: 'Wie baust du ein Angebot, das niemand ablehnen kann?',
    body: 'Alex Hormozi lehrt uns: Nimm jedes Risiko von den Schultern deines Kunden.\n\nDeshalb: Dein 1. Inserat auf JOBROOFS ist 100% kostenlos. 0 € Gebühren, 0 € Kreditkarte, sofort live. Warum zahlst du woanders 499 €?',
    offer: 'Hol dir dein kostenloses Inserat: jobroofs.com/post-a-job'
  },
  {
    r1: 'RULE #5:',
    r2: 'KEIN PAPIER. NUR ACTION.',
    sub: 'DER PROBETAG ENTSCHEIDET ALLES.',
    tags: 'HANDSCHLAG   |   PROBETAG   |   JOBROOFS',
    btn: 'MACHER EINSTELLEN',
    hook: 'Ein Lebenslauf zeigt, was jemand in der Vergangenheit getan hat. Ein Probetag zeigt, wer er heute ist.',
    body: 'Lade Leute ein. Schau dir die Energie an. Triff Entscheidungen in 60 Minuten statt 6 Wochen.',
    offer: 'Finde echte Macher auf jobroofs.com'
  },
  {
    r1: 'RULE #6:',
    r2: 'DER KIEZ GEHÖRT UNS.',
    sub: 'LOKALES RECRUITING SCHLÄGT GLOBALE PORTALE.',
    tags: 'HYPER-LOKAL   |   NACHBARSCHAFT   |   JOBROOFS',
    btn: 'KIEZ-POWER NUTZEN',
    hook: 'Die besten Mitarbeiter wohnen maximal 15 Minuten mit dem Fahrrad von deinem Laden entfernt.',
    body: 'Große Jobbörsen ballern deine Anzeige bundesweit raus. JOBROOFS konzentriert sich auf deinen Kiez.\n\nKeine Verspätungen wegen Stellwerkstörungen, keine langen Wege.',
    offer: 'Finde Nachbarn als Mitarbeiter: jobroofs.com'
  },
  {
    r1: 'RULE #7:',
    r2: 'DIE 150-POST CHALLENGE.',
    sub: 'WIR STOPPEN NICHT BIS WIR #1 SIND.',
    tags: 'UNAUFHALTSAM   |   30 TAGE VOLLGAS   |   JOBROOFS',
    btn: 'SEI DABEI',
    hook: 'Wir posten 5x am Tag, 30 Tage am Stück. 150 Botschaften für faire Arbeit und direktes Hiring.',
    body: 'Weil der Markt einen Weckruf braucht. Alte Portale ruhen sich auf ihren Monopolen aus. Wir bauen die Zukunft des temporären Arbeitens.',
    offer: 'Werde Teil von JOBROOFS: jobroofs.com'
  },
  {
    r1: 'RULE #8:',
    r2: 'FÜHRE DURCH WERTSCHÄTZUNG.',
    sub: 'GUTE LEUTE VERLASSEN KEINE JOBS, SONDERN CHEFS.',
    tags: 'LEADERSHIP   |   RESPEKT   |   JOBROOFS',
    btn: 'FÜHRUNG MIT HERZ',
    hook: 'Du willst Mitarbeiter, die mitdenken? Dann behandle sie nicht wie austauschbare Rädchen.',
    body: 'Pünktliche Bezahlung, offene Kommunikation, fairer Umgang. Die Betriebe auf JOBROOFS leben diesen Standard.',
    offer: 'Finde Jobs bei echten Chefs: jobroofs.com'
  },
  {
    r1: 'RULE #9:',
    r2: 'MUT ZUM KLARTEXT.',
    sub: 'WER JEDEN ANSICHERT, GEWINNT NIEMANDEN.',
    tags: 'POLARISIEREN   |   STANDPUNKT   |   JOBROOFS',
    btn: 'STANDPUNKT ZEIGEN',
    hook: 'Wir sind nicht für alle da. Wir sind für die Macher da.',
    body: 'Für Inhaber, die morgens um 6:00 den Laden aufschließen. Und für Arbeitskräfte, die abends um 23:00 noch mit einem Lächeln servieren.',
    offer: 'JOBROOFS verbindet die Macher: jobroofs.com'
  },
  {
    r1: 'RULE #10:',
    r2: 'MORGEN GEHT ES WEITER.',
    sub: 'DEINE NEUE SCHICHT BEGINNT JETZT.',
    tags: 'SCHLAF GUT   |   HIRE MORGEN   |   JOBROOFS',
    btn: 'JETZT INSERIEREN',
    hook: 'Morgen früh um 7:00 stehen wieder zehntausende Berliner an der U-Bahn und suchen einen Gig.',
    body: 'Stell sicher, dass dein Inserat heute Nacht schon online ist. In 2 Minuten live auf jobroofs.com.',
    offer: 'Schalte deine Stelle vor dem Schlafen: jobroofs.com/post-a-job'
  }
];

// ASSEMBLE 150 MASTER POSTS (30 DAYS × 5 SLOTS PER DAY)
const all150Posts = [];

const SLOTS = [
  { name: 'morning', time: '07:30 CET', title: 'Der Morgen-Klartext', pool: SEEKER_HOOKS, pillar: 'seeker' },
  { name: 'pre_lunch', time: '11:30 CET', title: 'Der Arbeitgeber-Weckruf', pool: EMPLOYER_HOOKS, pillar: 'employer' },
  { name: 'afternoon', time: '14:30 CET', title: 'Die Hormozi-Wahrheit', pool: CONTRARIAN_HOOKS, pillar: 'contrarian' },
  { name: 'evening', time: '18:30 CET', title: 'Der Kiez-Fokus', pool: KIEZ_HOOKS, pillar: 'kiez' },
  { name: 'late_night', time: '21:30 CET', title: 'Das Late-Night-Manifest', pool: MANIFESTO_RULES, pillar: 'manifesto' },
];

let globalId = 1;

for (let day = 1; day <= 30; day++) {
  for (let sIdx = 0; sIdx < SLOTS.length; sIdx++) {
    const slotConfig = SLOTS[sIdx];
    // Use multiplier 3 (coprime with 10) so all 10 items in each pool cycle across 30 days
    // Day 1 (day=1) remains 100% identical to preserve existing published history
    const itemIndex = ((day - 1) * 3 + sIdx) % slotConfig.pool.length;
    const item = slotConfig.pool[itemIndex];

    // Color rhythm: 10 distinct matte palettes cycled harmoniously
    const paletteIndex = ((day - 1) * 5 + sIdx) % paletteKeys.length;
    const colorKey = paletteKeys[paletteIndex];
    const palette = PALETTES[colorKey];

    let baseCaption = '';
    if (slotConfig.pillar === 'employer') {
      baseCaption = `${item.r1} ${item.r2} 🏢⚡ Inseriere auf JOBROOFS.\n\n${item.hook}\n\n${item.pain}\n\n${item.math}\n\n${item.offer}\n\n👉 In 2 Minuten kostenlos online gehen: jobroofs.com/post-a-job (Link in Bio)`;
    } else if (slotConfig.pillar === 'seeker') {
      baseCaption = `${item.r1} ${item.r2} ⚡ Finde deinen nächsten Gig.\n\n${item.hook}\n\n${item.body}\n\n${item.cta}\n\n✓ 1-Klick WhatsApp Direktkontakt\n✓ Transparent kalkulierter Stundenlohn ab Minute 1\n✓ 0% Zeitarbeit, 100% faire Inhaber\n\n👉 Alle offenen Jobs in deinem Kiez: jobroofs.com (Link in Bio)`;
    } else if (slotConfig.pillar === 'contrarian') {
      baseCaption = `${item.r1} ${item.r2} 🛑\n\n${item.hook}\n\n${item.body}\n\n${item.offer}\n\n👉 Der moderne Standard: jobroofs.com (Link in Bio)`;
    } else if (slotConfig.pillar === 'kiez') {
      baseCaption = `${item.r1} ${item.r2} 📍 Hyper-Lokal im Kiez.\n\n${item.hook}\n\n${item.body}\n\n${item.offer}\n\n👉 Finde Jobs vor deiner Haustür: jobroofs.com (Link in Bio)`;
    } else {
      baseCaption = `${item.r1} ${item.r2} 📜 Das JOBROOFS Manifest.\n\n${item.hook}\n\n${item.body}\n\n${item.offer}\n\n👉 Werde Teil der neuen Bewegung: jobroofs.com (Link in Bio)`;
    }

    const postObj = {
      id: globalId++,
      day,
      slot: slotConfig.name,
      slotTitle: slotConfig.title,
      time: slotConfig.time,
      pillar: slotConfig.pillar,
      role1: item.r1,
      role2: item.r2,
      subline: item.sub,
      tags: item.tags || '1-KLICK WHATSAPP   |   0% ZEITARBEIT   |   JOBROOFS',
      buttonText: item.btn || 'JOBROOFS.COM',
      colorway: colorKey,
      palette,
    };

    const highIntentHashtags = generateHashtagsForPost(postObj);
    postObj.germanCaption = formatCaptionWithHashtags(baseCaption, highIntentHashtags);
    postObj.hashtags = highIntentHashtags;

    all150Posts.push(postObj);
  }
}

const dest150 = path.join(dataDir, 'campaign-150-posts.json');
const dest100 = path.join(dataDir, 'campaign-100-posts.json');

fs.writeFileSync(dest150, JSON.stringify(all150Posts, null, 2));
fs.writeFileSync(dest100, JSON.stringify(all150Posts, null, 2));

console.log('================================================================');
console.log('🚀 150-POST MASTER CAMPAIGN GENERATED SUCCESSFULLY!');
console.log(`📅 Schedule: 30 Days × 5 Posts/Day = ${all150Posts.length} Total Posts`);
console.log('⏰ Time Slots: 07:30, 11:30, 14:30, 18:30, 21:30 CET');
console.log(`🎨 Palettes: ${paletteKeys.length} Matte Two-Tone Colorways`);
console.log(`💾 Saved to: ${dest150}`);
console.log('================================================================');
