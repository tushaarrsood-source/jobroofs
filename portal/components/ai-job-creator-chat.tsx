'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  FileText,
  Building2,
  MapPin,
  Phone,
  Mail,
  Loader2,
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

const STARTER_PROMPTS_DE = [
  '☕ Barista in Kreuzberg, 16€/Std, Minijob',
  '🍕 Küchenhilfe & Service in Mitte, 15,50€/Std',
  '📦 Fahrradkurier flexibel, E-Bike gestellt',
  '🧹 Reinigungskraft für Büro, 17€/Std',
];

const STARTER_PROMPTS_EN = [
  '☕ Barista in Kreuzberg, 16€/h, Minijob',
  '🍕 Kitchen Helper & Service in Mitte, 15.50€/h',
  '📦 Bike Courier flexible, E-Bike provided',
  '🧹 Office Cleaner, 17€/h',
];

export function AiJobCreatorChat({
  onApplyToForm,
  onSwitchToClassic,
  initialJobData,
}: AiJobCreatorChatProps) {
  const { isDe } = useTranslation();
  const starterPrompts = isDe ? STARTER_PROMPTS_DE : STARTER_PROMPTS_EN;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isDe
        ? 'Guten Tag! Ich unterstütze dich bei der schnellen Erstellung deines Stelleninserats. Beschreibe kurz, wen du suchst (z. B. "Suche Barista in Kreuzberg für 16 €/Std") oder füge einfach deine Notizen hier ein. Ich bereite das Inserat direkt strukturiert für dich vor.'
        : 'Welcome! I will help you craft your job listing in moments. Simply describe who you are looking for (e.g. "Looking for a barista in Kreuzberg, 16 €/hr") or paste your notes here. I will organize everything into a live listing for you.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedJob, setExtractedJob] = useState<ExtractedJobData>(initialJobData || {});
  const [quickReplies, setQuickReplies] = useState<string[]>(starterPrompts);
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
        throw new Error(errData.error || (isDe ? 'Verbindungsfehler beim Verarbeiten des Inserats.' : 'Connection error while processing listing.'));
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
      setError(err.message || (isDe ? 'Verbindung fehlgeschlagen. Bitte versuche es erneut.' : 'Connection failed. Please try again.'));
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
          ? 'Neuer Dialog gestartet. Welche Position möchtest du besetzen?'
          : 'New conversation started. Which position would you like to post?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setExtractedJob({});
    setQuickReplies(starterPrompts);
    setError(null);
  };

  const completeness = extractedJob.completeness || 0;
  const isReady = extractedJob.isReady || false;

  return (
    <div className="space-y-6">
      {/* Top Banner: Minimalist, Open Executive Header - ZERO BOX BOUNDARIES */}
      <div className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
            <MessageSquare className="size-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
              {isDe ? 'Jobroofs Inserat-Assistent' : 'Jobroofs Job Assistant'}
            </h2>
            <p className="text-base text-zinc-600 font-normal mt-0.5 leading-normal">
              {isDe
                ? 'Erstelle dein Inserat im direkten Dialog oder füge einfach deine Notizen ein.'
                : 'Draft your listing through quick conversation or paste your raw notes.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="apple-press inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-sm font-medium text-zinc-700 hover:text-black transition cursor-pointer"
            title={isDe ? 'Neu starten' : 'Start over'}
          >
            <RefreshCw className="size-3.5" />
            <span>{isDe ? 'Neu starten' : 'Start over'}</span>
          </button>
          <button
            type="button"
            onClick={onSwitchToClassic}
            className="apple-press inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-sm font-semibold text-black transition cursor-pointer"
          >
            <FileText className="size-4" />
            <span>{isDe ? 'Klassisches Formular' : 'Standard Form'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Chat Column | Right Live Preview Card Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat Pane (7 cols on desktop) - OPEN & BORDERLESS */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl sm:rounded-3xl bg-zinc-50 overflow-hidden h-[580px] sm:h-[660px]">
          {/* Chat Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 sm:gap-3.5 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`size-8 sm:size-9 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold ${
                    msg.role === 'user'
                      ? 'bg-zinc-800 text-white'
                      : 'bg-black text-white'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="size-4 sm:size-4.5" />
                  ) : (
                    <span className="font-bold text-xs tracking-wider">JR</span>
                  )}
                </div>

                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-base leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-tr-xs'
                      : 'bg-white text-zinc-900 rounded-tl-xs font-normal'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div
                    className={`mt-1.5 text-xs ${
                      msg.role === 'user' ? 'text-zinc-400 text-right' : 'text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2.5 sm:gap-3.5">
                <div className="size-8 sm:size-9 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                  <span className="font-bold text-xs tracking-wider">JR</span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-2.5 text-zinc-700 text-sm sm:text-base font-medium">
                  <Loader2 className="size-4.5 animate-spin text-zinc-800" />
                  <span>{isDe ? 'Inserat wird formuliert...' : 'Drafting listing...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips - Borderless Soft Pills */}
          {quickReplies.length > 0 && !loading && (
            <div className="px-3.5 sm:px-6 py-2.5 bg-zinc-50 flex flex-wrap gap-2">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(qr)}
                  className="apple-press text-xs sm:text-sm font-medium bg-zinc-200/80 hover:bg-zinc-300 text-zinc-800 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 transition-all cursor-pointer active:scale-[0.97]"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="px-4 py-3 bg-red-50 text-red-800 text-sm flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input Form with Borderless Soft Input */}
          <div className="p-3 sm:p-4 bg-white">
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
                className="flex-1 max-h-28 min-h-[48px] sm:min-h-[52px] px-4 py-3 text-base text-black placeholder:text-zinc-400 rounded-2xl bg-zinc-100 focus:bg-white focus:ring-2 focus:ring-black outline-none resize-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="apple-press size-11 sm:size-12 rounded-2xl bg-black hover:bg-zinc-800 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition cursor-pointer active:scale-[0.96]"
                title={isDe ? 'Nachricht senden' : 'Send message'}
              >
                <Send className="size-4.5" />
              </button>
            </form>
            <div className="mt-1.5 px-1 flex items-center justify-between text-xs text-zinc-500 font-normal">
              <span>{isDe ? 'Du kannst auch ganze Stellenbeschreibungen oder WhatsApp-Notizen einfügen.' : 'You can paste full job drafts or WhatsApp notes.'}</span>
              <span className="hidden sm:inline font-mono text-[11px] text-zinc-400">Shift+Enter = {isDe ? 'Zeilenumbruch' : 'New line'}</span>
            </div>
          </div>
        </div>

        {/* Live Ad Preview & Review (5 cols on desktop) - FLAT, OPEN, ZERO NESTED BOXES */}
        <div className="lg:col-span-5 space-y-3">
          {/* Header with Completeness Progress */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-zinc-800">
                {isDe ? 'Live Inserat-Vorschau' : 'Live Listing Preview'}
              </h3>
            </div>
            <span className="text-sm sm:text-base font-bold text-black font-mono">
              {completeness}% {isDe ? 'fertig' : 'ready'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
              style={{ width: `${completeness}%` }}
            />
          </div>

          {/* Simulated Job Card - SINGLE CLEAN SURFACE (NO NESTED BOXES) */}
          <div className="rounded-2xl sm:rounded-3xl bg-zinc-50 p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-black text-white px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider">
                Job
              </span>
              <span className="rounded-lg bg-white px-3 py-1 text-xs font-mono font-semibold text-zinc-800">
                {extractedJob.employmentType || (isDe ? 'Minijob (bis 603 €)' : 'Minijob / Part-Time')}
              </span>
              {extractedJob.wage && (
                <span className="rounded-lg bg-emerald-100 text-emerald-950 px-3 py-1 text-xs font-mono font-bold">
                  {extractedJob.wage}
                </span>
              )}
            </div>

            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-black tracking-tight leading-snug">
                {extractedJob.title || (
                  <span className="text-zinc-400 italic font-normal">
                    {isDe ? 'Stellenbezeichnung (z. B. Barista m/w/d)' : 'Job Title (e.g. Barista m/w/d)'}
                  </span>
                )}
              </h4>
              <div className="mt-1.5 flex items-center gap-2 text-sm sm:text-base text-zinc-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-4 text-zinc-500" />
                  {extractedJob.company || (
                    <span className="text-zinc-400 italic font-normal">{isDe ? 'Betrieb / Name' : 'Company Name'}</span>
                  )}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-zinc-500" />
                  {extractedJob.district || extractedJob.city || 'Berlin'}
                </span>
              </div>
            </div>

            {/* Description preview - CLEAN TEXT DIRECTLY ON CARD */}
            <div className="text-base text-zinc-800 leading-relaxed font-normal min-h-[70px]">
              {extractedJob.description ? (
                <p className="whitespace-pre-wrap">{extractedJob.description}</p>
              ) : (
                <p className="text-zinc-500 italic">
                  {isDe
                    ? 'Die Aufgaben- und Profilbeschreibung wird automatisch aus deinen Angaben erstellt...'
                    : 'Responsibilities and requirements will be composed automatically from your conversation...'}
                </p>
              )}
            </div>

            {/* Contact Channels Badge */}
            <div className="pt-1 flex flex-wrap gap-2 text-xs sm:text-sm font-medium text-zinc-800">
              {extractedJob.whatsapp && (
                <span className="inline-flex items-center gap-1.5 text-emerald-950 bg-emerald-100/70 px-3 py-1.5 rounded-xl font-medium">
                  <Phone className="size-3.5 text-emerald-800" />
                  WhatsApp: {extractedJob.whatsapp}
                </span>
              )}
              {extractedJob.contactEmail && (
                <span className="inline-flex items-center gap-1.5 text-zinc-900 bg-white px-3 py-1.5 rounded-xl font-medium">
                  <Mail className="size-3.5 text-zinc-500" />
                  {extractedJob.contactEmail}
                </span>
              )}
              {!extractedJob.whatsapp && !extractedJob.contactEmail && !extractedJob.phone && (
                <span className="text-zinc-500 text-xs sm:text-sm italic">
                  {isDe
                    ? 'Noch kein Direktkontakt (WhatsApp oder E-Mail) hinterlegt'
                    : 'No direct contact (WhatsApp or Email) added yet'}
                </span>
              )}
            </div>
          </div>

          {/* Action Card when Ready */}
          <div className="pt-1">
            {isReady ? (
              <div className="space-y-3">
                <div className="rounded-2xl bg-emerald-50 p-4 flex items-start gap-3 text-emerald-950">
                  <CheckCircle2 className="size-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm sm:text-base">
                      {isDe ? 'Inserat ist startklar' : 'Listing is ready'}
                    </p>
                    <p className="text-emerald-900 text-xs sm:text-sm mt-0.5 font-normal leading-normal">
                      {isDe
                        ? 'Alle Kernangaben sind erfasst. Du kannst das Inserat jetzt prüfen und freischalten.'
                        : 'All essential information has been recorded. Review and publish your ad.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onApplyToForm(extractedJob, 3)}
                  className="apple-press w-full py-4 px-6 rounded-2xl bg-black hover:bg-zinc-800 text-white text-base font-bold tracking-[0.02em] transition cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
                >
                  <span>{isDe ? 'Inserat prüfen & live schalten' : 'Review & Publish Listing'}</span>
                  <ArrowRight className="size-4.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onApplyToForm(extractedJob, 1)}
                  className="apple-press w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-sm font-semibold text-zinc-800 transition cursor-pointer text-center"
                >
                  {isDe ? 'Im Formular anpassen (Schritt 1)' : 'Customize in standard form (Step 1)'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={!extractedJob.title}
                  onClick={() => onApplyToForm(extractedJob, 1)}
                  className="apple-press w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 text-sm font-semibold text-black transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isDe ? 'Bisherige Daten ins Formular übernehmen' : 'Apply current data to standard form'}</span>
                  <ArrowRight className="size-3.5" />
                </button>
                <p className="text-xs sm:text-sm text-zinc-500 text-center font-normal">
                  {isDe
                    ? 'Nenne einfach noch kurz deinen Betrieb und deine WhatsApp-Nummer im Dialog.'
                    : 'Simply mention your business name and WhatsApp number in the chat.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
