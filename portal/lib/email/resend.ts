import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

// Default sender: Uses custom domain from env if set, otherwise Resend's default onboarding sender
const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL || 'JOBROOFS Berlin <onboarding@resend.dev>';

interface SendJobVerificationParams {
  to: string;
  code: string;
  jobTitle?: string;
  companyName?: string;
}

interface SendHousingVerificationParams {
  to: string;
  code: string;
  listingTitle?: string;
  district?: string;
}

/**
 * Sends a 6-digit verification email for job listings
 */
export async function sendJobVerificationEmail({
  to,
  code,
  jobTitle = 'Stellenangebot',
  companyName,
}: SendJobVerificationParams): Promise<{ success: boolean; id?: string; error?: any; devMode?: boolean }> {
  if (!resend) {
    console.warn(
      `\n=======================================================\n` +
        `[RESEND DEV MODE] RESEND_API_KEY not configured.\n` +
        `Verification email to: ${to}\n` +
        `Verification Code: ${code}\n` +
        `Listing: ${jobTitle} (${companyName || 'Arbeitgeber'})\n` +
        `=======================================================\n`,
    );
    return { success: true, devMode: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [to],
      subject: `Dein Verifizierungscode für dein Job-Inserat: ${code}`,
      html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifizierungscode für JOBROOFS</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 32px 16px; color: #1d1d1f; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.06); padding: 36px 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    
    <!-- Brand Header -->
    <div style="margin-bottom: 28px;">
      <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a;">
        JOB<span style="color: #2563eb;">ROOFS</span>
      </span>
      <span style="display: inline-block; margin-left: 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; color: #1d4ed8; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 2px 6px; vertical-align: middle; text-transform: uppercase;">
        BERLIN
      </span>
    </div>

    <!-- Main Title -->
    <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; letter-spacing: -0.3px;">
      Bestätige dein Job-Inserat
    </h1>
    <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin: 0 0 20px 0;">
      Vielen Dank für deine Anzeige auf JOBROOFS Berlin. Gib den folgenden 6-stelligen Code ein, um deine E-Mail-Adresse zu verifizieren und dein Inserat freizuschalten:
    </p>

    <!-- Details Box -->
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; border: 1px solid #e2e8f0; font-size: 13px; color: #334155;">
      <div><strong style="color: #0f172a;">Position:</strong> ${escapeHtml(jobTitle)}</div>
      ${companyName ? `<div style="margin-top: 4px;"><strong style="color: #0f172a;">Unternehmen:</strong> ${escapeHtml(companyName)}</div>` : ''}
    </div>

    <!-- OTP Code Display -->
    <div style="background-color: #f1f5f9; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px; border: 1px solid #cbd5e1;">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; color: #64748b; margin-bottom: 6px;">
        Verifizierungscode
      </div>
      <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
        ${code}
      </div>
      <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
        Gültig für 15 Minuten · Maximal 3 Versuche
      </div>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #94a3b8; margin: 0 0 24px 0;">
      Falls du dieses Inserat nicht auf JOBROOFS Berlin aufgegeben hast, kannst du diese Nachricht einfach ignorieren.
    </p>

    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0 16px 0;">

    <div style="font-size: 11px; color: #94a3b8; text-align: center;">
      JOBROOFS Berlin · Das Kiez-Portal für flexible Minijobs & Wohnungen<br>
      100% DSGVO-konform · Made in Berlin
    </div>
  </div>
</body>
</html>
      `,
      text: `Dein Verifizierungscode für dein Job-Inserat auf JOBROOFS Berlin: ${code}\n\nPosition: ${jobTitle}\nCode: ${code}\n\nDieser Code ist 15 Minuten gültig.\n\nFalls du diese Anzeige nicht erstellt hast, ignoriere diese E-Mail.`,
    });

    if (error) {
      console.error('[RESEND ERROR] Failed to send job verification email:', error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('[RESEND EXCEPTION] Error sending job verification email:', err);
    return { success: false, error: err };
  }
}

/**
 * Sends a 6-digit verification email for housing / apartment listings
 */
export async function sendHousingVerificationEmail({
  to,
  code,
  listingTitle = 'Wohnungsanzeige',
  district,
}: SendHousingVerificationParams): Promise<{ success: boolean; id?: string; error?: any; devMode?: boolean }> {
  if (!resend) {
    console.warn(
      `\n=======================================================\n` +
        `[RESEND DEV MODE] RESEND_API_KEY not configured.\n` +
        `Verification email to: ${to}\n` +
        `Verification Code: ${code}\n` +
        `Housing Listing: ${listingTitle} (${district || 'Berlin'})\n` +
        `=======================================================\n`,
    );
    return { success: true, devMode: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [to],
      subject: `Dein Verifizierungscode für deine Wohnungsanzeige: ${code}`,
      html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifizierungscode für deine Wohnungsanzeige</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 32px 16px; color: #1d1d1f; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.06); padding: 36px 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    
    <!-- Brand Header -->
    <div style="margin-bottom: 28px;">
      <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a;">
        JOB<span style="color: #059669;">ROOFS</span>
      </span>
      <span style="display: inline-block; margin-left: 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 4px; padding: 2px 6px; vertical-align: middle; text-transform: uppercase;">
        WOHNEN · BERLIN
      </span>
    </div>

    <!-- Main Title -->
    <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; letter-spacing: -0.3px;">
      Bestätige deine Wohnungsanzeige
    </h1>
    <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin: 0 0 20px 0;">
      Vielen Dank für dein Angebot auf JOBROOFS Berlin Wohnen. Als Teil unseres Berliner Anti-Scam-Schutzes verifizieren wir alle Inserenten per E-Mail:
    </p>

    <!-- Details Box -->
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; border: 1px solid #e2e8f0; font-size: 13px; color: #334155;">
      <div><strong style="color: #0f172a;">Inserat:</strong> ${escapeHtml(listingTitle)}</div>
      ${district ? `<div style="margin-top: 4px;"><strong style="color: #0f172a;">Bezirk / Kiez:</strong> ${escapeHtml(district)}</div>` : ''}
    </div>

    <!-- OTP Code Display -->
    <div style="background-color: #f1f5f9; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px; border: 1px solid #cbd5e1;">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; color: #64748b; margin-bottom: 6px;">
        Verifizierungscode
      </div>
      <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
        ${code}
      </div>
      <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
        Gültig für 15 Minuten · Maximal 3 Versuche
      </div>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #94a3b8; margin: 0 0 24px 0;">
      Falls du diese Wohnungsanzeige nicht auf JOBROOFS Berlin aufgegeben hast, kannst du diese Nachricht einfach ignorieren.
    </p>

    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0 16px 0;">

    <div style="font-size: 11px; color: #94a3b8; text-align: center;">
      JOBROOFS Berlin · Anti-Scam geschützte Kiez-Wohnungen & WG-Zimmer<br>
      100% DSGVO-konform · Made in Berlin
    </div>
  </div>
</body>
</html>
      `,
      text: `Dein Verifizierungscode für deine Wohnungsanzeige auf JOBROOFS Berlin: ${code}\n\nInserat: ${listingTitle}\nCode: ${code}\n\nDieser Code ist 15 Minuten gültig.\n\nFalls du diese Anzeige nicht erstellt hast, ignoriere diese E-Mail.`,
    });

    if (error) {
      console.error('[RESEND ERROR] Failed to send housing verification email:', error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('[RESEND EXCEPTION] Error sending housing verification email:', err);
    return { success: false, error: err };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
