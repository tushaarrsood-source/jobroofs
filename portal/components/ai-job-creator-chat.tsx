'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
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

export interface AiJobCreatorChatProps {
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
        ? 'Hi! Beschreibe kurz, wen du suchst – zum Beispiel Berufsbezeichnung, Bezirk und Stundenlohn. Du kannst auch einfach deine Notizen einfügen. Ich erstelle daraus dein fertiges Inserat.'
        : 'Hi! Simply tell me who you are looking for — for example job title, district, and hourly wage. You can also paste existing notes or drafts.',
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
        throw new Error(
          errData.error ||
            (isDe
              ? 'Verbindungsfehler beim Verarbeiten des Inserats.'
              : 'Connection error while processing listing.')
        );
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
      setError(
        err.message ||
          (isDe
            ? 'Verbindung fehlgeschlagen. Bitte versuche es erneut.'
            : 'Connection failed. Please try again.')
      );
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
          ? 'Neuer Dialog gestartet. Wen möchtest du einstellen?'
          : 'New conversation started. Who would you like to hire?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setExtractedJob({});
    setQuickReplies(starterPrompts);
    setError(null);
  };

  const isReady = extractedJob.isReady || false;
  const hasExtractedInfo = Boolean(extractedJob.title || extractedJob.company);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Subtle Status & Action Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-zinc-700">
            {isDe ? 'Direkt-Assistent aktiv' : 'Direct Assistant Active'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="apple-press inline-flex items-center gap-1.5 text-zinc-500 hover:text-black transition-colors cursor-pointer py-1"
          title={isDe ? 'Neu starten' : 'Start over'}
        >
          <RefreshCw className="size-3" />
          <span>{isDe ? 'Neu starten' : 'Reset'}</span>
        </button>
      </div>

      {/* Main Chat Stream - Open Canvas, Zero Enclosing Box */}
      <div className="space-y-4 sm:space-y-5 min-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar / Role Indicator */}
            <div
              className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                msg.role === 'user'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-200 text-zinc-800'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="size-4" />
              ) : (
                <span className="font-bold tracking-tighter">JR</span>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4.5 py-3 text-[15px] sm:text-[16px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-black text-white rounded-tr-xs shadow-xs'
                  : 'bg-zinc-100/80 text-zinc-900 rounded-tl-xs'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <div
                className={`mt-1 text-[11px] ${
                  msg.role === 'user' ? 'text-zinc-400 text-right' : 'text-zinc-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 text-xs font-bold">
              <span className="tracking-tighter">JR</span>
            </div>
            <div className="bg-zinc-100/80 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-2 text-zinc-600 text-sm">
              <Loader2 className="size-4 animate-spin text-zinc-800" />
              <span>{isDe ? 'Formuliert...' : 'Composing...'}</span>
            </div>
          </div>
        )}

        {/* Ready Action Banner - Appears Naturally in Flow When Listing is Formed */}
        {(isReady || hasExtractedInfo) && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs space-y-3 mt-4 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  <CheckCircle2 className="size-4" />
                  <span>
                    {isReady
                      ? isDe
                        ? 'Inserat ist startklar'
                        : 'Listing is ready'
                      : isDe
                        ? 'Erfasste Angaben'
                        : 'Captured details'}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-black mt-1">
                  {extractedJob.title || (isDe ? 'Stelle in Bearbeitung' : 'Job in progress')}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                  {[
                    extractedJob.company,
                    extractedJob.district || extractedJob.city,
                    extractedJob.wage,
                    extractedJob.employmentType,
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              </div>

              {extractedJob.completeness && (
                <span className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-full shrink-0">
                  {extractedJob.completeness}%
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onApplyToForm(extractedJob, isReady ? 3 : 1)}
                className="apple-press flex-1 py-3 px-5 rounded-xl bg-black hover:bg-zinc-800 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.98] cursor-pointer"
              >
                <span>
                  {isReady
                    ? isDe
                      ? 'Inserat prüfen & live schalten'
                      : 'Review & Publish Listing'
                    : isDe
                      ? 'Daten ins Formular übernehmen'
                      : 'Apply data to standard form'}
                </span>
                <ArrowRight className="size-4" />
              </button>

              {isReady && (
                <button
                  type="button"
                  onClick={() => onApplyToForm(extractedJob, 1)}
                  className="apple-press py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs sm:text-sm font-semibold text-zinc-800 transition cursor-pointer text-center"
                >
                  {isDe ? 'Im Formular bearbeiten' : 'Edit in standard form'}
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 text-red-900 text-sm flex items-center gap-2.5">
          <AlertCircle className="size-4.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Interactive Bottom Area: Starter Prompts + Input Bar */}
      <div className="space-y-3 pt-1">
        {/* Quick Suggestion Chips */}
        {quickReplies.length > 0 && !loading && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {quickReplies.map((qr, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(qr)}
                className="apple-press text-xs sm:text-[13px] font-medium bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-full px-3.5 py-1.5 transition-all shadow-2xs hover:border-zinc-300 active:scale-[0.97] cursor-pointer"
              >
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* Text Input Bar - High-Craft Rounded Pill */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 focus-within:border-zinc-400 focus-within:shadow-md transition-all p-2 sm:p-2.5 flex items-end gap-2"
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
                ? 'Beschreibe deine Stelle oder füge Notizen ein...'
                : 'Describe the position or paste your notes...'
            }
            rows={1}
            className="flex-1 max-h-32 min-h-[44px] py-2.5 px-3 text-[15px] sm:text-base text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none resize-none leading-relaxed"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="apple-press size-10 sm:size-11 rounded-full bg-black hover:bg-zinc-800 disabled:bg-zinc-100 text-white disabled:text-zinc-400 flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95 mb-0.5"
            title={isDe ? 'Nachricht senden' : 'Send'}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4 sm:size-4.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
