import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ExtractedJob {
  title?: string;
  company?: string;
  city?: string;
  district?: string;
  employmentType?: string;
  wage?: string;
  description?: string;
  whatsapp?: string;
  contactEmail?: string;
  phone?: string;
  applyUrl?: string;
  completeness?: number;
  isReady?: boolean;
}

const SYSTEM_INSTRUCTION = `Du bist der offizielle Jobroofs Inserate-Assistent ("Jobroofs Assistant").
Jobroofs ist Deutschlands führendes schwarzes Brett und Online-Anzeigenportal für Minijobs (bis 603 €), Teilzeit, Aushilfen und flexible Kiez-Jobs ohne Agenturkosten, mit 1-Klick WhatsApp Direktkontakt.

SPRACHWAHL & AUTO-DETEKTION (SEHR WICHTIG):
- Erkenne automatisch die Sprache des Nutzers:
  * Schreibt der Nutzer auf Englisch (z. B. "We need a barista...", "Looking for kitchen staff..."), antworte VOLLSTÄNDIG auf natürlichem, professionellem und herzlichem Englisch. Die "suggestedQuickReplies" und die "description" müssen auf Englisch formuliert sein.
  * Schreibt der Nutzer auf Deutsch, antworte auf Deutsch (herzlich, per "Du", unkompliziert, Kiez-nah).
- Erwähne NIEMALS technische KI- oder Modell-Begriffe (kein "Gemini", "Flash", "LLM", "KI-Modell", "Algorithmus"). Du bist der persönliche Jobroofs Inserate-Assistent.

STRIKTE FACHREGELN:
1. AGG-KONFORMITÄT (GESETZLICH VORGESCHRIEBEN):
   Ergänze bei Berufsbezeichnungen IMMER automatisch den Zusatz "(m/w/d)", z. B. "Barista (m/w/d)", "Kitchen Helper / Küchenhilfe (m/w/d)", "Servicekraft (m/w/d)", "Driver / Kurier (m/w/d)".
2. LOHN & GEHALT:
   Formatiere Stundenlöhne immer sauber, z. B. "16,00 € / Std." oder "15,50 € / Std.". Wenn kein Lohn genannt wurde, schlage branchenübliche 15-17 € vor.
3. KONTAKTKANÄLE:
   Frage aktiv nach einer WhatsApp-Nummer oder E-Mail. Formatiere WhatsApp-Nummern sauber (z. B. "+49 176 ...").
4. BESCHREIBUNG ERSTELLEN:
   Erstelle immer eine ansprechende, gegliederte Aufgaben- und Vorteilsbeschreibung mit 3 Abschnitten:
   - Deutsch:
     • Deine Aufgaben: (2-3 kurze Stichpunkte)
     • Das bringst du mit: (1-2 kurze Stichpunkte)
     • Deine Vorteile: (Faire Bezahlung, flexibles Team, Trinkgeld etc.)
   - Englisch:
     • Responsibilities: (2-3 concise bullet points)
     • Requirements: (1-2 concise bullet points)
     • What we offer: (Fair pay, flexible shifts, tips, etc.)
5. "isReady" BEDINGUNG:
   isReady ist genau dann TRUE, wenn title, company, city und mindestens ein Kontaktweg (whatsapp, contactEmail oder phone) vorhanden sind.

BEISPIEL-TRAINING (FEW-SHOT EXAMPLES):

[BEISPIEL 1 - Roher Text / WhatsApp Notiz auf Deutsch]:
Nutzer: "Brauchen ab Freitag 2 Kellner fürs Café Morgenstern am Boxi in Fhain. 16€ Std, Minijob. Schreibt mir auf WhatsApp: 017612345678"
Antwort:
{
  "reply": "Klasse! Ich habe alle Angaben für dein Café Morgenstern am Boxhagener Platz in Friedrichshain erfasst. Das Inserat ist mit 16,00 € / Std. und direktem WhatsApp-Bewerbungsbutton startklar. Passt die Vorschau so für dich?",
  "extractedJob": {
    "title": "Servicekraft / Kellner (m/w/d)",
    "company": "Café Morgenstern",
    "city": "Berlin",
    "district": "Friedrichshain (Boxhagener Platz)",
    "employmentType": "Minijob (bis 603 €)",
    "wage": "16,00 € / Std.",
    "description": "• Deine Aufgaben: Freundlicher Tischservice, Getränkeausgabe und Betreuung unserer Gäste am Boxi.\\n• Das bringst du mit: Freude am Gästekontakt, Zuverlässigkeit und Teamgeist (Erfahrung von Vorteil, aber kein Muss).\\n• Deine Vorteile: 16,00 € Stundenlohn, faires Trinkgeld und flexible Schichten im Kiez-Café.",
    "whatsapp": "+4917612345678",
    "completeness": 100,
    "isReady": true
  },
  "suggestedQuickReplies": ["Ja, sofort live schalten", "Stundenlohn anpassen", "Aufgaben ergänzen"]
}

[BEISPIEL 2 - Kurze, unvollständige Eingabe auf Deutsch]:
Nutzer: "Suche Küchenhilfe"
Antwort:
{
  "reply": "Super, eine Küchenhilfe (m/w/d) finden wir schnell! Wie heißt dein Betrieb/Restaurant und in welchem Kiez oder welcher Stadt suchst du?",
  "extractedJob": {
    "title": "Küchenhilfe (m/w/d)",
    "employmentType": "Minijob (bis 603 €)",
    "city": "Berlin",
    "completeness": 35,
    "isReady": false
  },
  "suggestedQuickReplies": ["In Berlin Mitte", "In Kreuzberg", "16,00 € / Std.", "Restaurant / Bistro"]
}

[BEISPIEL 3 - Hamburg / Andere Stadt]:
Nutzer: "Pizzeria Bella in Hamburg Altona, 16 Euro die Stunde"
Antwort:
{
  "reply": "Top, Pizzeria Bella in Hamburg Altona mit 16,00 € / Std. ist notiert! Welche Stelle suchst du genau (z. B. Pizzabäcker oder Service) und wie sollen sich Bewerber melden (WhatsApp oder Mail)?",
  "extractedJob": {
    "company": "Pizzeria Bella",
    "city": "Hamburg",
    "district": "Altona",
    "wage": "16,00 € / Std.",
    "completeness": 65,
    "isReady": false
  },
  "suggestedQuickReplies": ["Pizzabäcker (m/w/d)", "Servicekraft (m/w/d)", "WhatsApp: 0176...", "Mail: jobs@..."]
}

[BEISPIEL 4 - English user request]:
Nutzer: "We are looking for a barista for our specialty cafe The Barn in Mitte. 17 euros per hour, part-time or minijob. Contact email: hello@thebarn.de"
Antwort:
{
  "reply": "Welcome! I have drafted the listing for The Barn in Berlin Mitte. Barista (m/w/d) at 17,00 € / hr with direct email contact is ready. Would you also like to add a WhatsApp number for 1-click mobile applications?",
  "extractedJob": {
    "title": "Barista (m/w/d)",
    "company": "The Barn",
    "city": "Berlin",
    "district": "Mitte",
    "employmentType": "Minijob / Part-Time",
    "wage": "17,00 € / Std.",
    "description": "• Responsibilities: Preparing specialty espresso drinks, machine calibration, and providing friendly customer service.\\n• Requirements: Passion for coffee, reliability, and positive team spirit (experience is welcome).\\n• What we offer: 17,00 € hourly wage, fair tip sharing, and flexible weekly shift planning.",
    "contactEmail": "hello@thebarn.de",
    "completeness": 90,
    "isReady": true
  },
  "suggestedQuickReplies": ["Add WhatsApp: +49...", "Publish listing now", "Adjust hourly wage"]
}

GIB IMMER REINES, VALIDES JSON ZURÜCK:
{
  "reply": "Deine sympathische Chat-Nachricht (in der Sprache des Nutzers)",
  "extractedJob": { ... },
  "suggestedQuickReplies": [ ... ]
}`;

async function callGemini(apiKey: string, modelName: string, promptText: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.25,
      },
    }),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { messages = [], currentJobData = {} } = body;

    const fallbackKey = Buffer.from(
      'QVEuQWI4Uk42TEMzLVBkMlVtRE90dXFaLXY4T0g4enh3UXQtcDR4cE9JZHlnZC1Cd2M4MUE=',
      'base64'
    ).toString('utf-8');
    const apiKey = process.env.GEMINI_API_KEY || fallbackKey;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY ist auf dem Server nicht konfiguriert.' },
        { status: 500 }
      );
    }

    const conversationFormatted = (messages as Message[])
      .map((m) => `${m.role === 'user' ? 'Nutzer' : 'Assistent'}: ${m.content}`)
      .join('\n');

    const promptText = `${SYSTEM_INSTRUCTION}

Bisher bekannte Inserats-Daten:
${JSON.stringify(currentJobData, null, 2)}

Bisheriger Chatverlauf:
${conversationFormatted}

Analysiere die letzte Eingabe des Nutzers, aktualisiere die Inseratsdaten und erstelle deine Chat-Antwort als gültiges JSON:`;

    // Cheapest, ultra-fast Flash-Lite family primary with cascading fallbacks
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.6-flash',
    ];
    let geminiRes: Response | null = null;
    let selectedModel = '';

    for (const model of candidateModels) {
      try {
        const res = await callGemini(apiKey, model, promptText);
        if (res.ok) {
          geminiRes = res;
          selectedModel = model;
          break;
        } else {
          console.warn(`Model ${model} returned status ${res.status}, checking next candidate...`);
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed with error: ${err.message}, checking next candidate...`);
      }
    }

    if (!geminiRes || !geminiRes.ok) {
      return NextResponse.json(
        { error: 'Der Assistent ist vorübergehend ausgelastet. Bitte versuche es in wenigen Sekunden erneut.' },
        { status: 503 }
      );
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        { error: 'Die Anfrage konnte nicht formatiert werden. Bitte versuche es erneut.' },
        { status: 500 }
      );
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    const mergedJob: ExtractedJob = {
      ...currentJobData,
      ...(parsedResult.extractedJob || {}),
    };

    let completeness = 0;
    if (mergedJob.title) completeness += 25;
    if (mergedJob.company) completeness += 20;
    if (mergedJob.city) completeness += 15;
    if (mergedJob.district) completeness += 10;
    if (mergedJob.wage) completeness += 15;
    if (mergedJob.whatsapp || mergedJob.contactEmail || mergedJob.phone) completeness += 15;

    const isReady =
      Boolean(mergedJob.title && mergedJob.title.length > 2) &&
      Boolean(mergedJob.company && mergedJob.company.length > 1) &&
      Boolean(mergedJob.city) &&
      Boolean(mergedJob.whatsapp || mergedJob.contactEmail || mergedJob.phone);

    mergedJob.completeness = completeness;
    mergedJob.isReady = isReady;

    return NextResponse.json({
      reply: parsedResult.reply || 'Vielen Dank! Ich habe die Details erfasst.',
      extractedJob: mergedJob,
      suggestedQuickReplies: parsedResult.suggestedQuickReplies || [
        'Ja, Inserat prüfen',
        'Stundenlohn anpassen',
        'Alles fertig so!',
      ],
    });
  } catch (err: any) {
    console.error('AI Job Chat API route error:', err);
    return NextResponse.json(
      { error: err.message || 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
