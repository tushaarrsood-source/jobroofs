/**
 * Pure client & server text formatting utilities.
 * Losslessly converts paragraphs or raw lists into clean, structured bullet points.
 * Preserves 100% of original employer text without inventing or altering words.
 */

export function formatVerbatimPointers(text: unknown): string[] {
  if (Array.isArray(text)) {
    return text.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof text !== 'string') return [];

  const raw = text.trim();
  if (!raw) return [];

  // Split lines
  const lines = raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const pointers: string[] = [];

  for (const line of lines) {
    // Strip leading list bullets/numbering: e.g. "1.", "1)", "-", "•", "*", "–", ">"
    const cleaned = line.replace(/^(\d+[\.\)]|[-*•–—>])\s*/, '').trim();
    if (!cleaned) continue;

    // If paragraph contains multiple sentence points or semicolon separated items
    if (cleaned.length > 70 && (cleaned.includes('; ') || cleaned.includes('. '))) {
      // Split on punctuation followed by capital letters, numbers, or German umlauts
      const segments = cleaned
        .split(/(?<=[.;])\s+(?=[A-Z0-9ÄÖÜ€])/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (segments.length > 1) {
        pointers.push(...segments);
        continue;
      }
    }

    pointers.push(cleaned);
  }

  return pointers.filter((p) => p.length > 0);
}
