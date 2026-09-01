import { getD1 } from "@/db";

export function generateVerificationCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

export async function hashCode(code: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(code);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export async function storeVerificationCode(
  submissionId: string,
  code: string,
): Promise<void> {
  const d1 = getD1();
  const id = crypto.randomUUID();
  const codeHash = await hashCode(code);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await d1
    .prepare(
      `INSERT INTO verification_codes (id, submission_id, code_hash, expires_at)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(id, submissionId, codeHash, expiresAt)
    .run();
}

export async function validateVerificationCode(
  submissionId: string,
  code: string,
): Promise<boolean> {
  const d1 = getD1();
  const codeHash = await hashCode(code);

  const result = await d1
    .prepare(
      `SELECT id, code_hash, attempts, expires_at 
       FROM verification_codes 
       WHERE submission_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
    )
    .bind(submissionId)
    .first<{
      id: string;
      code_hash: string;
      attempts: number;
      expires_at: string;
    }>();

  if (!result) return false;

  const now = new Date().toISOString();
  if (result.expires_at < now) {
    return false;
  }

  if (result.attempts >= 3) {
    return false;
  }

  if (result.code_hash !== codeHash) {
    await d1
      .prepare(
        `UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ?`,
      )
      .bind(result.id)
      .run();
    return false;
  }

  return true;
}
