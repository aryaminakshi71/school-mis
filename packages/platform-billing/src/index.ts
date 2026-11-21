/**
 * @platform/billing — shared billing module for all products.
 *
 * Single source of truth for plans, pricing, GST, Stripe checkout/portal.
 * Framework-agnostic (plain functions) so each app can wrap it in its router.
 */

export interface Plan {
  id: 'starter' | 'growth' | 'pro' | 'enterprise';
  name: string;
  amount: number; // minor units (cents/paise)
  currency: 'usd' | 'inr';
  interval: 'month';
  features: string[];
}

export const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', amount: 2900, currency: 'usd', interval: 'month', features: ['core'] },
  { id: 'growth', name: 'Growth', amount: 7900, currency: 'usd', interval: 'month', features: ['core', 'ai'] },
  { id: 'pro', name: 'Pro', amount: 14900, currency: 'usd', interval: 'month', features: ['core', 'ai', 'white_label'] },
  { id: 'enterprise', name: 'Enterprise', amount: 49900, currency: 'usd', interval: 'month', features: ['core', 'ai', 'white_label', 'sso', 'sla'] },
];

/** India pricing (INR, paise). */
export const PLANS_INR: Plan[] = [
  { id: 'starter', name: 'Starter', amount: 99900, currency: 'inr', interval: 'month', features: ['core'] },
  { id: 'growth', name: 'Growth', amount: 299900, currency: 'inr', interval: 'month', features: ['core', 'ai'] },
  { id: 'pro', name: 'Pro', amount: 599900, currency: 'inr', interval: 'month', features: ['core', 'ai', 'white_label'] },
  { id: 'enterprise', name: 'Enterprise', amount: 0, currency: 'inr', interval: 'month', features: ['core', 'ai', 'white_label', 'sso', 'sla'] },
];

export function getPlans(currency: 'usd' | 'inr' = 'usd'): Plan[] {
  return currency === 'inr' ? PLANS_INR : PLANS;
}

export function hasFeature(planId: string, feature: string): boolean {
  const plan = [...PLANS, ...PLANS_INR].find((p) => p.id === planId);
  return !!plan?.features.includes(feature);
}

// ── GST (India) ───────────────────────────────────────────────
export const SAC_EDUCATION = '9992';

export interface GstBreakdown {
  base: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  isInterState: boolean;
}

export function calculateGst(amount: number, gstRate = 18, isInterState = false): GstBreakdown {
  const base = Number(amount) || 0;
  const gst = (base * gstRate) / 100;
  return {
    base,
    gstRate,
    cgst: isInterState ? 0 : gst / 2,
    sgst: isInterState ? 0 : gst / 2,
    igst: isInterState ? gst : 0,
    total: base + gst,
    isInterState,
  };
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(n) || 0);
}

// ── Stripe (REST, no SDK) ─────────────────────────────────────
export interface StripeConfig {
  secretKey: string;
  apiBase?: string;
}

async function stripePost(config: StripeConfig, path: string, body: Record<string, string>) {
  const res = await fetch(`${config.apiBase ?? 'https://api.stripe.com'}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  });
  const data: any = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Stripe request failed');
  return data;
}

export async function createCheckout(
  config: StripeConfig,
  input: { planId: string; successUrl: string; cancelUrl: string; customerEmail?: string; currency?: 'usd' | 'inr' },
) {
  const plan = getPlans(input.currency ?? 'usd').find((p) => p.id === input.planId);
  if (!plan) throw new Error('Unknown plan');
  const body: Record<string, string> = {
    mode: 'subscription',
    'line_items[0][price_data][currency]': plan.currency,
    'line_items[0][price_data][product_data][name]': plan.name,
    'line_items[0][price_data][unit_amount]': String(plan.amount),
    'line_items[0][price_data][recurring][interval]': 'month',
    'line_items[0][quantity]': '1',
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
  };
  if (input.customerEmail) body.customer_email = input.customerEmail;
  return stripePost(config, '/v1/checkout/sessions', body);
}

export async function createPortal(config: StripeConfig, input: { customerId: string; returnUrl: string }) {
  return stripePost(config, '/v1/billing_portal/sessions', {
    customer: input.customerId,
    return_url: input.returnUrl,
  });
}

/** Verify a Stripe webhook signature (HMAC-SHA256, t=timestamp,v1=signature). */
export async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  const parts = Object.fromEntries(signatureHeader.split(',').map((p) => p.split('=') as [string, string]));
  const timestamp = parts['t'];
  const expected = parts['v1'];
  if (!timestamp || !expected) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${timestamp}.${payload}`));
  const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex === expected;
}

/** Convert an amount to Indian-English words (for invoices). */
export function amountInWords(amount: number): string {
  const a = Math.floor(Number(amount) || 0);
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const two = (n: number): string => (n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : ''));
  const three = (n: number): string => (n >= 100 ? ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + two(n % 100) : '') : two(n));
  if (a === 0) return 'Zero Rupees Only';
  const crore = Math.floor(a / 10000000);
  const lakh = Math.floor((a % 10000000) / 100000);
  const thousand = Math.floor((a % 100000) / 1000);
  const rest = a % 1000;
  const parts: string[] = [];
  if (crore) parts.push(`${three(crore)} Crore`);
  if (lakh) parts.push(`${three(lakh)} Lakh`);
  if (thousand) parts.push(`${three(thousand)} Thousand`);
  if (rest) parts.push(three(rest));
  return parts.join(' ') + ' Rupees Only';
}
