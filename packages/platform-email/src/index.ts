/**
 * @platform/email — shared transactional email module for all products.
 *
 * Single source of truth for Resend delivery and branded HTML templates.
 * Framework-agnostic (plain functions) so each app can call it from its API.
 *
 * Usage:
 *   import { sendEmail, verificationEmail } from "@platform/email";
 *   await sendEmail(env, verificationEmail({ brand, to, name, url }));
 */

export interface EmailEnv {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  [key: string]: unknown;
}

export interface Brand {
  name: string;
  primaryColor?: string;
  logoUrl?: string | null;
  supportEmail?: string | null;
  websiteUrl?: string | null;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

const DEFAULT_BRAND: Brand = {
  name: "NucleoAI",
  primaryColor: "#6366f1",
  supportEmail: "support@nucleoai.com",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Wrap content in a responsive, brand-coloured email shell. */
export function brandedLayout(brand: Brand, content: string): string {
  const b = { ...DEFAULT_BRAND, ...brand };
  const color = b.primaryColor ?? DEFAULT_BRAND.primaryColor!;
  const logo = b.logoUrl
    ? `<img src="${escapeHtml(b.logoUrl)}" alt="${escapeHtml(b.name)}" height="40" style="display:block;margin:0 auto 16px;max-height:40px;" />`
    : `<div style="font-size:22px;font-weight:800;color:${color};text-align:center;margin-bottom:16px;">${escapeHtml(b.name)}</div>`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(b.name)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr>
              <td style="padding:32px 32px 8px;">
                ${logo}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 32px;color:#1f2937;font-size:15px;line-height:1.6;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.5;">
                <p style="margin:0 0 4px;">Sent by ${escapeHtml(b.name)}.</p>
                ${b.supportEmail ? `<p style="margin:0;">Need help? <a href="mailto:${escapeHtml(b.supportEmail)}" style="color:${color};text-decoration:none;">${escapeHtml(b.supportEmail)}</a></p>` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(brand: Brand, href: string, label: string): string {
  const color = brand.primaryColor ?? DEFAULT_BRAND.primaryColor!;
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:8px;margin:16px 0;">${escapeHtml(label)}</a>`;
}

/** Send an email through Resend. Throws if not configured or delivery fails. */
export async function sendEmail(env: EmailEnv, message: EmailMessage): Promise<{ id: string }> {
  const apiKey = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM ?? "noreply@nucleoai.com";
  if (!apiKey) {
    throw new Error("Email is not configured: RESEND_API_KEY is missing");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Email delivery failed (${response.status}): ${detail}`);
  }
  return (await response.json()) as { id: string };
}

/** Returns true when Resend is configured, so callers can fall back gracefully. */
export function isEmailConfigured(env: EmailEnv): boolean {
  return Boolean(env.RESEND_API_KEY);
}

// ─── Templates ────────────────────────────────────────────────────────────────

export function verificationEmail(opts: {
  brand: Brand;
  to: string;
  name?: string;
  url: string;
}): EmailMessage {
  const b = { ...DEFAULT_BRAND, ...opts.brand };
  const name = opts.name ? escapeHtml(opts.name) : "there";
  return {
    to: opts.to,
    subject: `Verify your email for ${b.name}`,
    html: brandedLayout(
      b,
      `<h1 style="margin:0 0 12px;font-size:20px;color:#111827;">Verify your email</h1>
       <p style="margin:0 0 8px;">Hi ${name},</p>
       <p style="margin:0 0 8px;">Thanks for signing up for ${escapeHtml(b.name)}. Confirm your email address to activate your account.</p>
       ${button(b, opts.url, "Verify email")}
       <p style="margin:0;color:#6b7280;font-size:13px;">If the button doesn't work, copy this link:<br /><a href="${escapeHtml(opts.url)}" style="color:${b.primaryColor};word-break:break-all;">${escapeHtml(opts.url)}</a></p>`,
    ),
    text: `Verify your email for ${b.name}: ${opts.url}`,
  };
}

export function passwordResetEmail(opts: {
  brand: Brand;
  to: string;
  name?: string;
  url: string;
}): EmailMessage {
  const b = { ...DEFAULT_BRAND, ...opts.brand };
  const name = opts.name ? escapeHtml(opts.name) : "there";
  return {
    to: opts.to,
    subject: `Reset your ${b.name} password`,
    html: brandedLayout(
      b,
      `<h1 style="margin:0 0 12px;font-size:20px;color:#111827;">Reset your password</h1>
       <p style="margin:0 0 8px;">Hi ${name},</p>
       <p style="margin:0 0 8px;">We received a request to reset your password. This link expires in 1 hour.</p>
       ${button(b, opts.url, "Reset password")}
       <p style="margin:0;color:#6b7280;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>`,
    ),
    text: `Reset your ${b.name} password: ${opts.url}`,
  };
}

export function welcomeEmail(opts: {
  brand: Brand;
  to: string;
  name?: string;
  dashboardUrl: string;
}): EmailMessage {
  const b = { ...DEFAULT_BRAND, ...opts.brand };
  const name = opts.name ? escapeHtml(opts.name) : "there";
  return {
    to: opts.to,
    subject: `Welcome to ${b.name}`,
    html: brandedLayout(
      b,
      `<h1 style="margin:0 0 12px;font-size:20px;color:#111827;">Welcome aboard 🎉</h1>
       <p style="margin:0 0 8px;">Hi ${name},</p>
       <p style="margin:0 0 8px;">Your ${escapeHtml(b.name)} account is ready. Here are a few things you can do next:</p>
       <ul style="margin:0 0 8px;padding-left:20px;">
         <li>Complete your organization profile</li>
         <li>Invite your team</li>
         <li>Explore the dashboard</li>
       </ul>
       ${button(b, opts.dashboardUrl, "Open dashboard")}`,
    ),
    text: `Welcome to ${b.name}. Open your dashboard: ${opts.dashboardUrl}`,
  };
}

export function inviteEmail(opts: {
  brand: Brand;
  to: string;
  inviterName?: string;
  organizationName?: string;
  role?: string;
  url: string;
}): EmailMessage {
  const b = { ...DEFAULT_BRAND, ...opts.brand };
  const org = opts.organizationName ? escapeHtml(opts.organizationName) : escapeHtml(b.name);
  const inviter = opts.inviterName ? escapeHtml(opts.inviterName) : "A teammate";
  return {
    to: opts.to,
    subject: `${inviter} invited you to ${org}`,
    html: brandedLayout(
      b,
      `<h1 style="margin:0 0 12px;font-size:20px;color:#111827;">You're invited</h1>
       <p style="margin:0 0 8px;">${inviter} invited you to join <strong>${org}</strong>${opts.role ? ` as <strong>${escapeHtml(opts.role)}</strong>` : ""}.</p>
       ${button(b, opts.url, "Accept invitation")}
       <p style="margin:0;color:#6b7280;font-size:13px;">This invitation expires in 7 days.</p>`,
    ),
    text: `${inviter} invited you to ${org}. Accept: ${opts.url}`,
  };
}

export function invoiceEmail(opts: {
  brand: Brand;
  to: string;
  name?: string;
  invoiceNumber: string;
  amount: string;
  dueDate?: string;
  url: string;
}): EmailMessage {
  const b = { ...DEFAULT_BRAND, ...opts.brand };
  const name = opts.name ? escapeHtml(opts.name) : "there";
  return {
    to: opts.to,
    subject: `Invoice ${opts.invoiceNumber} from ${b.name}`,
    html: brandedLayout(
      b,
      `<h1 style="margin:0 0 12px;font-size:20px;color:#111827;">Invoice ${escapeHtml(opts.invoiceNumber)}</h1>
       <p style="margin:0 0 8px;">Hi ${name},</p>
       <p style="margin:0 0 8px;">Your invoice for <strong>${escapeHtml(opts.amount)}</strong> is ready${opts.dueDate ? ` and is due on ${escapeHtml(opts.dueDate)}` : ""}.</p>
       ${button(b, opts.url, "View invoice")}`,
    ),
    text: `Invoice ${opts.invoiceNumber} for ${opts.amount}: ${opts.url}`,
  };
}

export function paymentReceiptEmail(opts: {
  brand: Brand;
  to: string;
  name?: string;
  amount: string;
  planName?: string;
  url?: string;
}): EmailMessage {
  const b = { ...DEFAULT_BRAND, ...opts.brand };
  const name = opts.name ? escapeHtml(opts.name) : "there";
  return {
    to: opts.to,
    subject: `Payment received — ${b.name}`,
    html: brandedLayout(
      b,
      `<h1 style="margin:0 0 12px;font-size:20px;color:#111827;">Payment received</h1>
       <p style="margin:0 0 8px;">Hi ${name},</p>
       <p style="margin:0 0 8px;">We received your payment of <strong>${escapeHtml(opts.amount)}</strong>${opts.planName ? ` for the <strong>${escapeHtml(opts.planName)}</strong> plan` : ""}. Thank you!</p>
       ${opts.url ? button(b, opts.url, "View receipt") : ""}`,
    ),
    text: `Payment of ${opts.amount} received. Thank you!`,
  };
}
