// format.js — one job: turn raw numbers and dates into readable Indonesian text.
// All amounts are whole rupiah, rounded to the nearest thousand at the source.
export function idr(amount) {
  const sign = amount < 0 ? '-' : '';
  const digits = String(Math.abs(Math.round(amount))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return sign + 'Rp ' + digits;
}

export function idrShort(amount) {
  if (Math.abs(amount) >= 1000000) {
    const millions = amount / 1000000;
    const text = Number.isInteger(millions) ? String(millions) : millions.toFixed(1).replace('.', ',');
    return 'Rp ' + text + ' jt';
  }
  return 'Rp ' + Math.round(amount / 1000) + ' rb';
}

export function pct(part, whole) {
  if (!whole) return '0%';
  return (part / whole * 100).toFixed(1).replace('.', ',') + '%';
}

export function pctWhole(part, whole) {
  if (!whole) return '0%';
  return Math.round(part / whole * 100) + '%';
}

const MONTH_DAYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
  '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];

export function dateLabel(day) {
  return MONTH_DAYS[day - 1] + ' Nov 2026';
}

export function monthName(monthIndex, year) {
  const names = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
    'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return names[monthIndex] + ' ' + year;
}

// Projected finish month: start at November 2026 (month index 10) and add
// ceil(remaining / monthly) whole months. Pure arithmetic, no clock.
export function finishMonth(remaining, monthly) {
  if (monthly <= 0) return '—';
  const months = Math.max(0, Math.ceil(remaining / monthly));
  const total = 10 + months;
  return monthName(total % 12, 2026 + Math.floor(total / 12));
}
