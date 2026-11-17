/**
 * GST utilities (India)
 *
 * Education services SAC: 9992. Intra-state → CGST + SGST (9% + 9%),
 * inter-state → IGST (18%). Rates are configurable per school.
 */

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

export function calculateGst(
  amount: number,
  gstRate = 18,
  isInterState = false,
): GstBreakdown {
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
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);
}

export function amountInWords(amount: number): string {
  const a = Math.floor(Number(amount) || 0);
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
  ];
  const two = (n: number): string =>
    n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  const three = (n: number): string =>
    n >= 100 ? ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + two(n % 100) : '') : two(n);

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
