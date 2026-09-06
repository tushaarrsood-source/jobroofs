const memorySuppressed = new Set<string>();

// Get path to suppressed jobs file in data directory (Node runtime only)
function getSuppressedFilePath(): string | null {
  if (typeof window !== 'undefined') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    return path.join(dataDir, 'suppressed-jobs.json');
  } catch {
    return null;
  }
}

// Load initially from file if on server
function loadSuppressedFromFile(): Set<string> {
  if (typeof window !== 'undefined') return memorySuppressed;
  const filePath = getSuppressedFilePath();
  if (!filePath) return memorySuppressed;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        list.forEach((id: string) => memorySuppressed.add(String(id)));
      }
    }
  } catch (err) {
    // Ignore on read-only runtimes
  }
  return memorySuppressed;
}

// Save to file if on server
function saveSuppressedToFile() {
  if (typeof window !== 'undefined') return;
  const filePath = getSuppressedFilePath();
  if (!filePath) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    fs.writeFileSync(
      filePath,
      JSON.stringify(Array.from(memorySuppressed), null, 2),
      'utf-8',
    );
  } catch (err) {
    // Ignore on read-only runtimes
  }
}

// Initialize on module load
if (typeof window === 'undefined') {
  loadSuppressedFromFile();
}

/**
 * Check if a job ID or slug has been suppressed / deleted
 */
export function isJobSuppressed(idOrSlug: string): boolean {
  if (!idOrSlug) return false;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('jobroofs_suppressed_jobs');
      if (raw) {
        const clientSet = new Set(JSON.parse(raw));
        if (clientSet.has(idOrSlug)) return true;
      }
    } catch {}
  }
  return memorySuppressed.has(idOrSlug);
}

/**
 * Suppress / delete a job from the portal
 */
export function suppressJob(idOrSlug: string): void {
  if (!idOrSlug) return;
  memorySuppressed.add(idOrSlug);
  if (typeof window === 'undefined') {
    saveSuppressedToFile();
  } else {
    try {
      const raw = localStorage.getItem('jobroofs_suppressed_jobs');
      const current = raw ? JSON.parse(raw) : [];
      if (!current.includes(idOrSlug)) {
        current.push(idOrSlug);
        localStorage.setItem('jobroofs_suppressed_jobs', JSON.stringify(current));
        window.dispatchEvent(new Event('jobroofs_jobs_suppressed'));
      }
    } catch {}
  }
}

/**
 * Unsuppress / restore a previously deleted job
 */
export function unsuppressJob(idOrSlug: string): void {
  if (!idOrSlug) return;
  memorySuppressed.delete(idOrSlug);
  if (typeof window === 'undefined') {
    saveSuppressedToFile();
  } else {
    try {
      const raw = localStorage.getItem('jobroofs_suppressed_jobs');
      if (raw) {
        const current = JSON.parse(raw);
        const filtered = current.filter((item: string) => item !== idOrSlug);
        localStorage.setItem('jobroofs_suppressed_jobs', JSON.stringify(filtered));
        window.dispatchEvent(new Event('jobroofs_jobs_suppressed'));
      }
    } catch {}
  }
}

/**
 * Get all suppressed job IDs
 */
export function getSuppressedJobs(): string[] {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('jobroofs_suppressed_jobs');
      if (raw) return JSON.parse(raw);
    } catch {}
  }
  return Array.from(memorySuppressed);
}
