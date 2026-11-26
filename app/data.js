// data.js — the sample household's figures for November 2026.
// One fictional family: Keluarga Wijaya, Jakarta. Every total on the site is
// computed from TRANSACTIONS below — no total is typed twice anywhere.
// Amounts are whole rupiah, rounded to the nearest thousand.

export const HOUSEHOLD = {
  name: 'Keluarga Wijaya',
  city: 'Jakarta',
  month: 'November 2026',
  members: 'Budi & Sari, dan anak mereka Dimas (9)',
  // "Today" inside the sample month, used only for bill countdowns.
  // A fixed constant on purpose: the site never reads the real clock.
  referenceDay: 26,
};

export const INCOME = [
  { source: 'Gaji Budi — staf gudang', amount: 12500000 },
  { source: 'Gaji Sari — kasir toko', amount: 8000000 },
  { source: 'Freelance desain — Sari', amount: 1500000 },
];

// Budget per category for the month. `spent` is never stored here — it is
// always summed from TRANSACTIONS, so the budget page can never disagree
// with the transaction list.
export const CATEGORIES = [
  { id: 'groceries', name: 'Belanja harian', budget: 3500000, color: '#0e5d4b' },
  { id: 'eating', name: 'Makan di luar', budget: 1800000, color: '#d98a1f' },
  { id: 'transport', name: 'Transportasi', budget: 1500000, color: '#2563a8' },
  { id: 'housing', name: 'Rumah & utilitas', budget: 3200000, color: '#7a5ea8' },
  { id: 'school', name: 'Sekolah & anak', budget: 2500000, color: '#c2507a' },
  { id: 'health', name: 'Kesehatan', budget: 800000, color: '#3d8a5f' },
  { id: 'entertainment', name: 'Hiburan', budget: 700000, color: '#b3382c' },
  { id: 'shopping', name: 'Belanja barang', budget: 1500000, color: '#8a6d3b' },
  { id: 'savings', name: 'Tabungan', budget: 4000000, color: '#0a4437' },
];

export const SAVINGS_ID = 'savings';

// day = day of November 2026. 48 transactions.
export const TRANSACTIONS = [
  // Belanja harian — Rp 3.120.000
  { day: 2, desc: 'Pasar Tradisional — belanja mingguan', cat: 'groceries', amount: 485000 },
  { day: 5, desc: 'Supermarket — belanja bulanan', cat: 'groceries', amount: 520000 },
  { day: 9, desc: 'Pasar Tradisional — sayur & buah', cat: 'groceries', amount: 310000 },
  { day: 12, desc: 'Supermarket — stok dapur', cat: 'groceries', amount: 465000 },
  { day: 16, desc: 'Pasar Tradisional — ikan & ayam', cat: 'groceries', amount: 290000 },
  { day: 19, desc: 'Supermarket — belanja mingguan', cat: 'groceries', amount: 540000 },
  { day: 26, desc: 'Pasar Tradisional — sayur & buah', cat: 'groceries', amount: 510000 },
  // Makan di luar — Rp 1.640.000
  { day: 3, desc: 'Warteg — makan siang', cat: 'eating', amount: 85000 },
  { day: 7, desc: 'Restoran keluarga — makan malam', cat: 'eating', amount: 240000 },
  { day: 10, desc: 'Bakso & mie ayam', cat: 'eating', amount: 120000 },
  { day: 14, desc: 'Ayam geprek — makan siang', cat: 'eating', amount: 180000 },
  { day: 18, desc: 'Warteg — makan siang', cat: 'eating', amount: 95000 },
  { day: 21, desc: 'Restoran — ulang tahun Sari', cat: 'eating', amount: 320000 },
  { day: 24, desc: 'Soto & sate — makan malam', cat: 'eating', amount: 275000 },
  { day: 27, desc: 'Seafood — makan malam keluarga', cat: 'eating', amount: 325000 },
  // Transportasi — Rp 1.280.000
  { day: 4, desc: 'Bensin Pertalite', cat: 'transport', amount: 250000 },
  { day: 8, desc: 'GoRide — ke kantor', cat: 'transport', amount: 150000 },
  { day: 11, desc: 'Bensin Pertalite', cat: 'transport', amount: 180000 },
  { day: 15, desc: 'Tol & parkir', cat: 'transport', amount: 130000 },
  { day: 18, desc: 'Bensin Pertalite', cat: 'transport', amount: 220000 },
  { day: 22, desc: 'Servis motor — ganti oli', cat: 'transport', amount: 300000 },
  { day: 28, desc: 'Cuci motor & steam', cat: 'transport', amount: 50000 },
  // Rumah & utilitas — Rp 2.950.000
  { day: 3, desc: 'Internet — IndiHome', cat: 'housing', amount: 650000 },
  { day: 6, desc: 'Listrik PLN', cat: 'housing', amount: 850000 },
  { day: 6, desc: 'Air PDAM', cat: 'housing', amount: 320000 },
  { day: 10, desc: 'Iuran RT & kebersihan', cat: 'housing', amount: 480000 },
  { day: 17, desc: 'Gas LPG & air galon', cat: 'housing', amount: 650000 },
  // Sekolah & anak — Rp 2.300.000
  { day: 1, desc: 'SPP sekolah — Dimas', cat: 'school', amount: 900000 },
  { day: 5, desc: 'Les bahasa Inggris — Dimas', cat: 'school', amount: 450000 },
  { day: 9, desc: 'Buku & alat tulis', cat: 'school', amount: 350000 },
  { day: 13, desc: 'Les renang — Dimas', cat: 'school', amount: 400000 },
  { day: 20, desc: 'Uang saku anak — minggu ke-3', cat: 'school', amount: 200000 },
  // Kesehatan — Rp 620.000
  { day: 7, desc: 'Apotek — obat flu', cat: 'health', amount: 150000 },
  { day: 12, desc: 'Dokter gigi — kontrol', cat: 'health', amount: 250000 },
  { day: 19, desc: 'Vitamin & suplemen', cat: 'health', amount: 120000 },
  { day: 25, desc: 'Pijat & obat herbal', cat: 'health', amount: 100000 },
  // Hiburan — Rp 540.000
  { day: 8, desc: 'Bioskop keluarga', cat: 'entertainment', amount: 180000 },
  { day: 15, desc: 'Taman bermain anak', cat: 'entertainment', amount: 150000 },
  { day: 15, desc: 'Langganan streaming', cat: 'entertainment', amount: 150000 },
  { day: 22, desc: 'Karaoke keluarga', cat: 'entertainment', amount: 60000 },
  // Belanja barang — Rp 1.350.000
  { day: 10, desc: 'Baju anak — Dimas', cat: 'shopping', amount: 450000 },
  { day: 14, desc: 'Sepatu sekolah', cat: 'shopping', amount: 320000 },
  { day: 18, desc: 'Peralatan dapur', cat: 'shopping', amount: 280000 },
  { day: 23, desc: 'Skincare — Sari', cat: 'shopping', amount: 180000 },
  { day: 27, desc: 'Pulsa & paket data', cat: 'shopping', amount: 120000 },
  // Tabungan — Rp 4.000.000 (transfer, bukan belanja)
  { day: 2, desc: 'Transfer — dana darurat', cat: 'savings', amount: 2000000 },
  { day: 10, desc: 'Transfer — dana Lebaran', cat: 'savings', amount: 1200000 },
  { day: 20, desc: 'Transfer — tabungan motor', cat: 'savings', amount: 800000 },
];

// Recurring bills. `paid` is the sample month's state; the toggle on the
// Bills page flips it live. Amounts match the transactions above where the
// bill is also a transaction (listrik, air, internet, SPP, les, streaming).
export const BILLS = [
  { name: 'SPP sekolah — Dimas', amount: 900000, dueDay: 1, paid: true },
  { name: 'Internet — IndiHome', amount: 650000, dueDay: 3, paid: true },
  { name: 'Les bahasa Inggris — Dimas', amount: 450000, dueDay: 5, paid: true },
  { name: 'Listrik PLN', amount: 850000, dueDay: 6, paid: true },
  { name: 'Air PDAM', amount: 320000, dueDay: 6, paid: true },
  { name: 'BPJS Kesehatan', amount: 350000, dueDay: 10, paid: true },
  { name: 'Langganan streaming', amount: 150000, dueDay: 15, paid: true },
  { name: 'Asuransi jiwa', amount: 500000, dueDay: 28, paid: false },
];

// Savings goals. `saved` grows with the "add funds" control on the Goals page.
export const GOALS = [
  { name: 'Dana darurat', target: 15000000, saved: 9200000, monthly: 2000000,
    note: 'Untuk 3 bulan pengeluaran darurat — target 6 bulan ke depan.' },
  { name: 'Dana Lebaran', target: 6000000, saved: 3600000, monthly: 1200000,
    note: 'THR dan baju baru — dipakai saat Lebaran tahun depan.' },
  { name: 'Motor baru', target: 18000000, saved: 4500000, monthly: 800000,
    note: 'Ganti motor lama yang sudah 9 tahun — ditabung pelan-pelan.' },
];

// ---- Aggregation: every figure on the site comes from these functions. ----

export function totalIncome() {
  return INCOME.reduce((sum, row) => sum + row.amount, 0);
}

export function categorySpent(transactions, categoryId) {
  return transactions
    .filter((t) => t.cat === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalSpent(transactions) {
  return transactions
    .filter((t) => t.cat !== SAVINGS_ID)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalSaved(transactions) {
  return categorySpent(transactions, SAVINGS_ID);
}

export function categoryTotals(transactions) {
  return CATEGORIES.map((c) => ({
    ...c,
    spent: categorySpent(transactions, c.id),
  }));
}

// Spending (excluding savings transfers) grouped by week of the month.
export function weeklySpending(transactions) {
  const weeks = [
    { label: 'Minggu 1', range: '1–7 Nov', total: 0 },
    { label: 'Minggu 2', range: '8–14 Nov', total: 0 },
    { label: 'Minggu 3', range: '15–21 Nov', total: 0 },
    { label: 'Minggu 4', range: '22–30 Nov', total: 0 },
  ];
  for (const t of transactions) {
    if (t.cat === SAVINGS_ID) continue;
    const index = t.day <= 7 ? 0 : t.day <= 14 ? 1 : t.day <= 21 ? 2 : 3;
    weeks[index].total += t.amount;
  }
  return weeks;
}

export function latestTransactions(transactions, count) {
  return [...transactions]
    .sort((a, b) => b.day - a.day)
    .slice(0, count);
}
