'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  FileText,
  Building2,
  MapPin,
  Banknote,
  Phone,
  Mail,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

export interface ExtractedJobData {
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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiJobCreatorChatProps {
  onApplyToForm: (data: ExtractedJobData, targetStep?: 1 | 2 | 3) => void;
  onSwitchToClassic: () => void;
  initialJobData?: Partial<ExtractedJobData>;
}

const STARTER_PROMPTS = [
  '☕ Barista in Kreuzberg, 16€/Std, Minijob',
  '🍕 Küchenhilfe & Service in Mitte, 15,50€/Std',
  '📦 Fahrradkurier flexibel, E-Bike gestellt',
  '🧹 Reinigungskraft für Büro, 17€/Std',
];

export function AiJobCreatorChat({
  onApplyToForm,
  onSwitchToClassic,
  initialJobData,
}: AiJobCreatorChatProps) {
  const { isDe } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isDe
        ? 'Hi! 👋 Ich bin dein Jobroofs KI-Assistent. Erzähl mir einfach kurz, wen du suchst (z. B. "Suche Barista in Kreuzberg für 16€/Std"), oder kopiere deine Stellenbeschreibung hier hinein. Ich erstelle dein fertiges Inserat in Sekundenschnelle!'
        : 'Hi! 👋 I am your Jobroofs AI Assistant. Just tell me who you are looking for (e.g. "Looking for a barista in Kreuzberg, 16€/h"), or paste your job description here. I will build your ad in seconds!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedJob, setExtractedJob] = useState<ExtractedJobData>(initialJobData || {});
  const [quickReplies, setQuickReplies] = useState<string[]>(STARTER_PROMPTS);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    setError(null);
    setInput('');

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/job-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          currentJobData: extractedJob,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Fehler bei der Kommunikation mit dem KI-Assistenten.');
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.extractedJob) {
        setExtractedJob(data.extractedJob);
      }

      if (data.suggestedQuickReplies && data.suggestedQuickReplies.length > 0) {
        setQuickReplies(data.suggestedQuickReplies);
      }
    } catch (err: any) {
      setError(err.message || 'Verbindung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: isDe
          ? 'Neuer Chat gestartet! Erzähl mir einfach, wen du suchst.'
          : 'New chat started! Tell me who you are looking for.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setExtractedJob({});
    setQuickReplies(STARTER_PROMPTS);
    setError(null);
  };

  const completeness = extractedJob.completeness || 0;
  const isReady = extractedJob.isReady || false;

  return (
    <div className="space-y-4">
      {/* Top Banner with Model Badge & Classic Mode Switcher */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="size-5 text-amber-300 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-black">Jobroofs KI-Assistent</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              {isDe
                ? 'Erstelle dein Inserat im Gespräch — oder kopiere einfach eine Stellenanzeige hinein.'
                : 'Create your listing through conversation — or paste an existing job description.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="apple-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-600 hover:text-black hover:bg-zinc-50 transition cursor-pointer"
            title="Chat zurücksetzen"
          >
            <RefreshCw className="size-3" />
            <span>Neu starten</span>
          </button>
          <button
            type="button"
            onClick={onSwitchToClassic}
            className="apple-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-black transition cursor-pointer"
          >
            <FileText className="size-3" />
            <span>Klassisches Formular</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Chat Column | Right Live Preview Card Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Chat Pane (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden h-[580px]">
          {/* Chat Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`size-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.role === 'user'
                      ? 'bg-zinc-900 text-white'
                      : 'bg-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {msg.role === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-tr-xs'
                      : 'bg-zinc-100 text-zinc-900 rounded-tl-xs border border-zinc-200/70'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div
                    className={`mt-1 text-[10px] font-mono ${
                      msg.role === 'user' ? 'text-zinc-400 text-right' : 'text-zinc-600'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="size-4" />
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-2 text-zinc-600 text-[12.5px]">
                  <Loader2 className="size-3.5 animate-spin text-emerald-600" />
                  <span>Jobroofs KI formuliert Inserat...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          {quickReplies.length > 0 && !loading && (
            <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50/70 flex flex-wrap gap-1.5">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(qr)}
                  className="apple-press text-[11.5px] font-medium bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-lg px-2.5 py-1 transition-all cursor-pointer shadow-2xs active:scale-[0.97]"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input Form */}
          <div className="p-3 border-t border-zinc-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isDe
                    ? 'Beschreibe die Stelle oder antworte hier... (Enter zum Senden)'
                    : 'Describe the job or reply here... (Enter to send)'
                }
                rows={1}
                className="flex-1 max-h-24 min-h-[42px] px-3.5 py-2 text-sm text-black placeholder:text-zinc-400 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none resize-none transition-colors shadow-2xs"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="apple-press size-10 rounded-xl bg-black hover:bg-zinc-800 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition cursor-pointer shadow-xs active:scale-[0.96]"
                title="Nachricht senden"
              >
                <Send className="size-4" />
              </button>
            </form>
            <div className="mt-1.5 px-1 flex items-center justify-between text-[10.5px] text-zinc-600 font-light">
              <span>Tipp: Du kannst auch ganze Fließtexte oder Stichpunkte hineinkopieren.</span>
              <span className="font-mono">Shift+Enter = Neue Zeile</span>
            </div>
          </div>
        </div>

        {/* Live Ad Preview & Review Card (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs">
            {/* Header with Completeness Progress */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-700">
                  Live Inserat-Vorschau
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-black">
                {completeness}% fertig
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${completeness}%` }}
              />
            </div>

            {/* Simulated Job Card */}
            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-md bg-black text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider">
                  Job
                </span>
                <span className="rounded-md bg-white border border-zinc-200 px-2 py-0.5 text-[9px] font-mono font-semibold text-zinc-800">
                  {extractedJob.employmentType || 'Minijob'}
                </span>
                {extractedJob.wage && (
                  <span className="rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300/60 px-2 py-0.5 text-[9px] font-mono font-bold">
                    {extractedJob.wage}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-black tracking-tight leading-snug">
                  {extractedJob.title || (
                    <span className="text-zinc-400 italic">Stellenbezeichnung (z. B. Barista m/w/d)</span>
                  )}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3.5 text-zinc-500" />
                    {extractedJob.company || <span className="text-zinc-400 italic">Betrieb</span>}
                  </span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-zinc-500" />
                    {extractedJob.district || extractedJob.city || 'Berlin'}
                  </span>
                </div>
              </div>

              {/* Description preview */}
              <div className="text-[12px] text-zinc-700 bg-white p-3 rounded-lg border border-zinc-200/80 leading-relaxed font-light min-h-[70px]">
                {extractedJob.description ? (
                  <p className="whitespace-pre-wrap">{extractedJob.description}</p>
                ) : (
                  <p className="text-zinc-600 italic">
                    Die Aufgaben- und Profilbeschreibung wird automatisch aus dem Chat zusammengestellt...
                  </p>
                )}
              </div>

              {/* Contact Channels Badge */}
              <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-700">
                {extractedJob.whatsapp && (
                  <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <Phone className="size-3 text-emerald-700" />
                    WhatsApp: {extractedJob.whatsapp}
                  </span>
                )}
                {extractedJob.contactEmail && (
                  <span className="inline-flex items-center gap-1 text-zinc-800 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">
                    <Mail className="size-3 text-zinc-500" />
                    {extractedJob.contactEmail}
                  </span>
                )}
                {!extractedJob.whatsapp && !extractedJob.contactEmail && !extractedJob.phone && (
                  <span className="text-zinc-600 text-[11px] italic">
                    Noch kein Direktkontakt (WhatsApp oder E-Mail) hinterlegt
                  </span>
                )}
              </div>
            </div>

            {/* Action Card when Ready */}
            <div className="mt-4 pt-2">
              {isReady ? (
                <div className="space-y-2.5">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-300/80 p-3 flex items-start gap-2.5 text-emerald-950">
                    <CheckCircle2 className="size-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold">Inserat ist bereit!</p>
                      <p className="text-emerald-800/90 text-[11.5px] mt-0.5">
                        Alle Kernangaben sind erfasst. Du kannst das Inserat jetzt prüfen und freischalten.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onApplyToForm(extractedJob, 3)}
                    className="apple-press w-full py-3 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white text-[13px] font-bold tracking-[0.02em] transition cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
                  >
                    <span>Inserat prüfen & live schalten</span>
                    <ArrowRight className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onApplyToForm(extractedJob, 1)}
                    className="apple-press w-full py-2 px-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition cursor-pointer text-center"
                  >
                    Im Formular anpassen (Schritt 1)
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={!extractedJob.title}
                    onClick={() => onApplyToForm(extractedJob, 1)}
                    className="apple-press w-full py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 text-xs font-semibold text-black transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Bisherige Daten ins Formular übernehmen</span>
                    <ArrowRight className="size-3" />
                  </button>
                  <p className="text-[11px] text-zinc-600 text-center font-light">
                    Schreibe einfach noch kurz z. B. deinen Betrieb und deine WhatsApp-Nummer in den Chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
