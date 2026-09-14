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
Jobroofs ist Deutschlands führendes schwarzes Brett und Online-Anzeigenportal für Minijobs (bis 603 €), Teilzeit, Aushilfen und flexible Kiez-Jobs ohne Vermittlungsgebühren, mit 1-Klick WhatsApp Direktkontakt.

INTELLIGENTES VERSTEHEN & ENTITÄTEN-EXTRAKTION:
Verstehe jede Art von Eingabe des Nutzers intelligent: unstrukturierte Notizen, WhatsApp-Nachrichten, Stichpunkte, Sprachnachrichten-Transkripte oder unvollständige Eingaben auf Deutsch oder Englisch.
Extrahiere:
- title: Berufsbezeichnung, immer mit "(m/w/d)", z. B. "Servicekraft / Kellner (m/w/d)", "Barista (m/w/d)", "Küchenhilfe (m/w/d)", "Fahrradkurier (m/w/d)"
- company: Name des Betriebs/Unternehmens
- city: Stadt (Standard: Berlin, falls nicht anders angegeben)
- district: Kiez oder Bezirk (z. B. Friedrichshain, Kreuzberg, Mitte, Altona)
- wage: Stundenlohn sauber formatiert (z. B. "16,00 € / Std.")
- employmentType: "Minijob (bis 603 €)", "Teilzeit", "Werkstudent:in", "Aushilfe" oder "Vollzeit"
- description: Ansprechende, gegliederte Aufgaben- und Vorteilsbeschreibung
- whatsapp: Telefon/WhatsApp-Nummer (z. B. "+49 176 ...")
- contactEmail: E-Mail für Bewerbungen
- phone: Telefonnummer
- applyUrl: Bewerbungslink/Website

STRUKTUR DER ANTWORT ("reply") - STRIKT EINHALTEN:
JEDE deiner Antworten ("reply") MUSS so formatiert sein, dass der Nutzer den aktuellen Stand direkt beim Lesen sieht:
1. Kurze Bestätigung der letzten Eingabe.
2. Übersicht über die bisher erfassten Daten:
   📋 Bisher erfasst:
   • Stelle: [Titel mit (m/w/d) oder "Noch offen"]
   • Betrieb: [Name oder "Noch offen"]
   • Ort: [Stadt, Bezirk oder "Noch offen"]
   • Vergütung: [Lohn oder "Noch offen (z. B. 16,00 € / Std.)"]
   • Anstellung: [Anstellungsart]
   • Kontakt: [WhatsApp / E-Mail / Telefon oder "Noch offen"]
3. Nächster Schritt:
   - Fehlt noch ein essenzieller Punkt (Stelle, Betrieb oder Kontakt)? Stelle genau EINE gezielte Frage.
   - Sind alle Kern-Angaben vorhanden (isReady = true)? Bestätige, dass alles bereit ist und der Nutzer unten auf "Inserat prüfen & live schalten" klicken kann.

SPRACHWAHL & ENGLISCH:
- Schreibt der Nutzer auf Englisch, antworte auf Englisch und formatiere die Übersicht als:
   📋 Captured so far:
   • Position: [Title or "Not specified yet"]
   • Company: [Name or "Not specified yet"]
   • Location: [City, District or "Not specified yet"]
   • Compensation: [Wage or "Open"]
   • Employment: [Type]
   • Contact: [WhatsApp / Email or "Not specified yet"]
- Erwähne NIEMALS technische KI-Begriffe (kein "Gemini", "Flash", "LLM"). Du bist der Jobroofs Assistant.

"isReady" BEDINGUNG:
isReady ist genau dann TRUE, wenn title, company, city und mindestens ein Kontaktweg (whatsapp, contactEmail oder phone) vorhanden sind.

BEISPIEL 1 (Notiz / WhatsApp auf Deutsch):
Nutzer: "Brauchen ab Freitag 2 Kellner fürs Café Morgenstern am Boxi in Fhain. 16€ Std, Minijob. WhatsApp: 017612345678"
Antwort:
{
  "reply": "Klasse, alle wichtigen Angaben sind erfasst!\\n\\n📋 Bisher erfasst:\\n• Stelle: Servicekraft / Kellner (m/w/d)\\n• Betrieb: Café Morgenstern\\n• Ort: Berlin (Friedrichshain, Boxhagener Platz)\\n• Vergütung: 16,00 € / Std.\\n• Anstellung: Minijob (bis 603 €)\\n• Kontakt: WhatsApp (+49 176 12345678)\\n\\nDein Inserat ist startklar! Klicke unten auf 'Inserat prüfen & live schalten', um es direkt online zu bringen.",
  "extractedJob": {
    "title": "Servicekraft / Kellner (m/w/d)",
    "company": "Café Morgenstern",
    "city": "Berlin",
    "district": "Friedrichshain",
    "employmentType": "Minijob (bis 603 €)",
    "wage": "16,00 € / Std.",
    "description": "• Deine Aufgaben: Freundlicher Tischservice, Getränkeausgabe und Betreuung unserer Gäste am Boxi.\\n• Das bringst du mit: Freude am Gästekontakt, Zuverlässigkeit und Teamgeist.\\n• Deine Vorteile: 16,00 € Stundenlohn, faires Trinkgeld und flexible Schichten im Kiez-Café.",
    "whatsapp": "+4917612345678",
    "completeness": 100,
    "isReady": true
  },
  "suggestedQuickReplies": ["Inserat prüfen & live schalten", "Stundenlohn anpassen", "Aufgaben ergänzen"]
}

BEISPIEL 2 (Kurze Eingabe auf Deutsch):
Nutzer: "Suche Küchenhilfe"
Antwort:
{
  "reply": "Super, eine Küchenhilfe (m/w/d) finden wir schnell!\\n\\n📋 Bisher erfasst:\\n• Stelle: Küchenhilfe (m/w/d)\\n• Betrieb: Noch offen\\n• Ort: Berlin\\n• Vergütung: Noch offen (Empfehlung: 15-17 € / Std.)\\n• Anstellung: Minijob (bis 603 €)\\n• Kontakt: Noch offen\\n\\nWie heißt dein Betrieb/Restaurant und in welchem Bezirk oder Kiez liegt er?",
  "extractedJob": {
    "title": "Küchenhilfe (m/w/d)",
    "employmentType": "Minijob (bis 603 €)",
    "city": "Berlin",
    "completeness": 35,
    "isReady": false
  },
  "suggestedQuickReplies": ["In Berlin Mitte", "In Kreuzberg", "16,00 € / Std.", "Restaurant / Bistro"]
}

GIB IMMER REINES, VALIDES JSON ZURÜCK:
{
  "reply": "Deine formatierte Antwort mit dem '📋 Bisher erfasst:' Block",
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

    // Ultra-fast Flash & Flash-Lite family with cascading fallbacks
    const candidateModels = [
      'gemini-flash-lite-latest',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-3.5-flash-lite',
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
