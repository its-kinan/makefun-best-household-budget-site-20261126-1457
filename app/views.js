// views.js — one renderer per page. Each returns an HTML string from the
// live state; every number shown is computed from that state, never typed in.
// `actions` is handed down from main.js so controls update the state and
// re-render the page they sit on.

import { idr, idrShort, pct, pctWhole, dateLabel, finishMonth } from './format.js';
import { HOUSEHOLD, CATEGORIES, SAVINGS_ID, totalIncome, totalSpent, totalSaved,
  categoryTotals, weeklySpending, latestTransactions } from './data.js';
import { donutChart, barChart } from './charts.js';

export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sampleNote() {
  return `<p class="sample-note">Data contoh &mdash; ${esc(HOUSEHOLD.name)}, ${esc(HOUSEHOLD.city)}, ${esc(HOUSEHOLD.month)}</p>`;
}

function statusOf(spent, budget) {
  if (spent > budget) return { word: 'Melebihi', cls: 'over' };
  if (spent > budget * 0.8) return { word: 'Waspada', cls: 'watch' };
  return { word: 'Terkendali', cls: '' };
}

function categoryName(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.name : id;
}

function transactionRows(transactions) {
  if (!transactions.length) return `<tr><td colspan="4" class="empty">Tidak ada transaksi yang cocok. Ubah filter atau kata kunci pencarian.</td></tr>`;
  return transactions.map((t) => `<tr>
    <td>${dateLabel(t.day)}</td>
    <td>${esc(t.desc)}</td>
    <td>${esc(categoryName(t.cat))}</td>
    <td class="num">${idr(t.amount)}</td>
  </tr>`).join('');
}

// ---- Overview -------------------------------------------------------------

export function overviewView(state) {
  const income = totalIncome();
  const spent = totalSpent(state.transactions);
  const saved = totalSaved(state.transactions);
  const remaining = income - spent - saved;
  const totals = categoryTotals(state.transactions).filter((c) => c.id !== SAVINGS_ID);
  const top = [...totals].sort((a, b) => b.spent - a.spent);
  const weeks = weeklySpending(state.transactions);
  const upcoming = state.bills
    .filter((b) => !b.paid && b.dueDay >= HOUSEHOLD.referenceDay && b.dueDay <= HOUSEHOLD.referenceDay + 7)
    .sort((a, b) => a.dueDay - b.dueDay);
  const recent = latestTransactions(state.transactions, 6);

  const cards = `
  <section class="grid cards" aria-label="Ringkasan bulan">
    <div class="card"><div class="stat-label">Pemasukan</div><div class="stat-value">${idr(income)}</div><div class="stat-sub">3 sumber: gaji Budi, gaji Sari, freelance</div></div>
    <div class="card"><div class="stat-label">Belanja</div><div class="stat-value">${idr(spent)}</div><div class="stat-sub">${pctWhole(spent, income)} dari pemasukan &middot; ${state.transactions.filter((t) => t.cat !== SAVINGS_ID).length} transaksi</div></div>
    <div class="card"><div class="stat-label">Ditabung</div><div class="stat-value good">${idr(saved)}</div><div class="stat-sub">Tingkat tabungan ${pct(saved, income)} dari pemasukan</div></div>
    <div class="card"><div class="stat-label">Sisa untuk dibelanjakan</div><div class="stat-value ${remaining < 0 ? 'bad' : ''}">${idr(remaining)}</div><div class="stat-sub">Pemasukan &minus; belanja &minus; tabungan</div></div>
  </section>`;

  const donut = donutChart(
    totals.map((c) => ({ name: c.name, value: c.spent, color: c.color })),
    idrShort(spent), 'belanja bulan ini');
  const legend = totals.map((c) => `<span><i class="dot" style="background:${c.color}"></i>${esc(c.name)} &mdash; ${pct(c.spent, spent)}</span>`).join('');

  const topList = top.slice(0, 4).map((c) => `<li><span>${esc(c.name)}<span class="sub">${pct(c.spent, spent)} dari belanja</span></span><strong>${idr(c.spent)}</strong></li>`).join('');

  const upcomingList = upcoming.length
    ? upcoming.map((b) => `<li><span>${esc(b.name)}<span class="sub">Jatuh tempo ${dateLabel(b.dueDay)} &mdash; ${b.dueDay - HOUSEHOLD.referenceDay} hari lagi</span></span><strong>${idr(b.amount)}</strong></li>`).join('')
    : '<li><span>Semua tagihan 7 hari ke depan sudah lunas.</span><span></span></li>';

  const recentRows = recent.map((t) => `<li><span>${esc(t.desc)}<span class="sub">${dateLabel(t.day)} &middot; ${esc(categoryName(t.cat))}</span></span><strong>${idr(t.amount)}</strong></li>`).join('');

  return `
  <h1>Ringkasan ${esc(HOUSEHOLD.month)}</h1>
  <p class="lede">${esc(HOUSEHOLD.name)}, ${esc(HOUSEHOLD.city)} &mdash; ${esc(HOUSEHOLD.members)}. Bulan ini pemasukan <strong>${idr(income)}</strong>, belanja <strong>${idr(spent)}</strong>, dan <strong>${idr(saved)}</strong> masuk tabungan, jadi tersisa <strong>${idr(remaining)}</strong> untuk dibelanjakan sampai akhir bulan.</p>
  ${sampleNote()}
  ${cards}
  <div class="grid overview-main" style="margin-top:16px">
    <section class="card" aria-label="Belanja per kategori">
      <h2>Belanja per kategori</h2>
      <div class="chart-wrap">${donut}</div>
      <div class="legend">${legend}</div>
      <h3 style="margin-top:18px">Kategori terbesar</h3>
      <ul class="list-plain">${topList}</ul>
    </section>
    <div class="grid" style="gap:16px">
      <section class="card" aria-label="Belanja mingguan">
        <h2>Belanja per minggu</h2>
        ${barChart(weeks.map((w) => ({ label: w.label, sub: w.range, value: w.total })), idrShort)}
        <p class="small muted">Minggu 1 paling besar karena listrik, air, dan SPP dibayar di awal bulan. Transfer tabungan tidak dihitung sebagai belanja.</p>
      </section>
      <section class="card" aria-label="Tagihan mendatang">
        <h2>Tagihan 7 hari ke depan</h2>
        <ul class="list-plain">${upcomingList}</ul>
        <p style="margin-top:12px"><a href="#/bills">Lihat semua tagihan &rarr;</a></p>
      </section>
      <section class="card" aria-label="Transaksi terbaru">
        <h2>Transaksi terbaru</h2>
        <ul class="list-plain">${recentRows}</ul>
        <p style="margin-top:12px"><a href="#/transactions">Lihat semua ${state.transactions.length} transaksi &rarr;</a></p>
      </section>
    </div>
  </div>`;
}

// ---- Budget ---------------------------------------------------------------

export function budgetView(state) {
  const totals = categoryTotals(state.transactions);
  const spent = totalSpent(state.transactions);
  const saved = totalSaved(state.transactions);
  const budgeted = totals.reduce((sum, c) => sum + state.budgets[c.id], 0);
  const rows = totals.map((c) => {
    const budget = state.budgets[c.id];
    const status = statusOf(c.spent, budget);
    const width = budget > 0 ? Math.min(100, c.spent / budget * 100) : 0;
    const left = budget - c.spent;
    return `<div class="meter-row">
      <div class="meter-top">
        <span><span class="meter-name">${esc(c.name)}</span><span class="pill ${status.cls}">${status.word}</span></span>
        <span class="meter-nums">${idr(c.spent)} / ${idr(budget)}<small>${left >= 0 ? 'sisa ' + idr(left) : 'lebih ' + idr(-left)} &middot; ${pct(c.spent, budget)}</small></span>
      </div>
      <span class="bar-track" style="display:block"><span class="bar-fill ${status.cls}" style="display:block;width:${width.toFixed(1)}%"></span></span>
      <span class="meter-edit">
        <label for="budget-${c.id}">Ubah anggaran</label>
        <input type="number" id="budget-${c.id}" min="0" step="1000" value="${budget}" data-budget-input="${c.id}" aria-label="Anggaran ${esc(c.name)}">
        <button class="small ghost" data-budget-save="${c.id}">Simpan</button>
      </span>
    </div>`;
  }).join('');

  return `
  <h1>Anggaran bulan ini</h1>
  <p class="lede">Total anggaran <strong>${idr(budgeted)}</strong> untuk ${esc(HOUSEHOLD.month)}; belanja tercatat <strong>${idr(spent)}</strong> dan tabungan <strong>${idr(saved)}</strong>. Setiap bar memakai angka yang sama dengan halaman Transaksi &mdash; ubah anggaran di bawah dan barnya ikut berubah.</p>
  ${sampleNote()}
  <section class="card" aria-label="Anggaran per kategori">
    <h2>Per kategori</h2>
    ${rows}
  </section>
  <p class="form-note">Aturan praktis yang dipakai keluarga ini: kebutuhan pokok (belanja harian, rumah, sekolah, transportasi, kesehatan) sekitar 70% dari anggaran, keinginan sekitar 15%, tabungan 18% dari pemasukan. Lihat <a href="#/tips">Tips</a> untuk cara membaca angka-angka ini.</p>`;
}

// ---- Transactions ---------------------------------------------------------

export function transactionsView(state, ui) {
  const cats = CATEGORIES;
  let list = [...state.transactions];
  if (ui.filter !== 'all') list = list.filter((t) => t.cat === ui.filter);
  if (ui.search.trim()) {
    const q = ui.search.trim().toLowerCase();
    list = list.filter((t) => t.desc.toLowerCase().includes(q));
  }
  if (ui.sort === 'amount-desc') list.sort((a, b) => b.amount - a.amount);
  else if (ui.sort === 'amount-asc') list.sort((a, b) => a.amount - b.amount);
  else if (ui.sort === 'date-asc') list.sort((a, b) => a.day - b.day);
  else list.sort((a, b) => b.day - a.day);

  const filteredTotal = list.reduce((sum, t) => sum + t.amount, 0);
  const options = cats.map((c) => `<option value="${c.id}" ${ui.filter === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('');

  return `
  <h1>Transaksi</h1>
  <p class="lede">Semua ${state.transactions.length} transaksi ${esc(HOUSEHOLD.month)} — saring per kategori, cari, urutkan, atau tambah transaksi baru. Total di bawah selalu dihitung dari baris yang sedang ditampilkan.</p>
  ${sampleNote()}
  <section class="card" aria-label="Saring transaksi">
    <div class="toolbar">
      <label class="small" for="f-cat">Kategori</label>
      <select id="f-cat" data-filter>${'<option value="all">Semua kategori</option>'}${options}</select>
      <input type="search" id="f-search" placeholder="Cari, mis. pasar, listrik, bensin&hellip;" value="${esc(ui.search)}" data-search aria-label="Cari transaksi">
      <label class="small" for="f-sort">Urutkan</label>
      <select id="f-sort" data-sort>
        <option value="date-desc" ${ui.sort === 'date-desc' ? 'selected' : ''}>Tanggal terbaru</option>
        <option value="date-asc" ${ui.sort === 'date-asc' ? 'selected' : ''}>Tanggal terlama</option>
        <option value="amount-desc" ${ui.sort === 'amount-desc' ? 'selected' : ''}>Jumlah terbesar</option>
        <option value="amount-asc" ${ui.sort === 'amount-asc' ? 'selected' : ''}>Jumlah terkecil</option>
      </select>
    </div>
    <table>
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead>
      <tbody>${transactionRows(list)}</tbody>
      <tfoot><tr class="total-row"><td colspan="3">Total yang ditampilkan (${list.length} transaksi)</td><td class="num" data-filtered-total>${idr(filteredTotal)}</td></tr></tfoot>
    </table>
  </section>
  <section class="card" style="margin-top:16px" aria-label="Tambah transaksi">
    <h2>Tambah transaksi</h2>
    <form data-add-form>
      <div class="form-grid">
        <label>Tanggal (Nov 2026)<input type="number" name="day" min="1" max="30" value="26" required></label>
        <label>Keterangan<input type="text" name="desc" maxlength="80" placeholder="mis. Pasar — sayur" required></label>
        <label>Kategori<select name="cat">${options}</select></label>
        <label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="1000" placeholder="150000" required></label>
      </div>
      <p style="margin-top:14px"><button type="submit">Tambah transaksi</button></p>
    </form>
    <p class="form-note" data-add-note>Transaksi baru langsung masuk tabel dan semua total &mdash; di halaman ini, di Ringkasan, dan di Anggaran &mdash; ikut berubah.</p>
  </section>`;
}

// ---- Bills ----------------------------------------------------------------

export function billsView(state) {
  const rows = state.bills.map((b, i) => {
    const days = b.dueDay - HOUSEHOLD.referenceDay;
    let status;
    let pill;
    if (b.paid) { status = 'Lunas'; pill = 'paid'; }
    else if (days < 0) { status = 'Terlambat ' + (-days) + ' hari'; pill = 'over'; }
    else if (days <= 3) { status = 'Jatuh tempo ' + (days === 0 ? 'hari ini' : 'dalam ' + days + ' hari'); pill = 'due'; }
    else { status = 'Jatuh tempo ' + dateLabel(b.dueDay); pill = ''; }
    return `<tr>
      <td>${esc(b.name)}</td>
      <td class="num">${idr(b.amount)}</td>
      <td>${dateLabel(b.dueDay)}</td>
      <td><span class="pill ${pill}">${status}</span></td>
      <td><button class="small ${b.paid ? 'ghost' : ''}" data-bill-toggle="${i}">${b.paid ? 'Batalkan lunas' : 'Tandai lunas'}</button></td>
    </tr>`;
  }).join('');
  const unpaidTotal = state.bills.filter((b) => !b.paid).reduce((sum, b) => sum + b.amount, 0);
  const paidCount = state.bills.filter((b) => b.paid).length;

  return `
  <h1>Tagihan &amp; pembayaran rutin</h1>
  <p class="lede">${paidCount} dari ${state.bills.length} tagihan bulan ini sudah lunas; yang belum dibayar total <strong>${idr(unpaidTotal)}</strong>. Tandai lunas saat sudah dibayar &mdash; status dan totalnya langsung berubah. Acuan hari ini di contoh ini: ${dateLabel(HOUSEHOLD.referenceDay)}.</p>
  ${sampleNote()}
  <section class="card" aria-label="Daftar tagihan">
    <table>
      <thead><tr><th>Tagihan</th><th class="num">Jumlah</th><th>Jatuh tempo</th><th>Status</th><th>Aksi</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </section>
  <p class="form-note">Tagihan yang juga tercatat sebagai transaksi (listrik, air, internet, SPP, les, streaming) memakai jumlah yang sama di kedua halaman. BPJS dan asuransi dibayar terpisah dan tidak masuk daftar transaksi bulan ini.</p>`;
}

// ---- Goals ----------------------------------------------------------------

export function goalsView(state) {
  const cards = state.goals.map((g, i) => {
    const left = Math.max(0, g.target - g.saved);
    const width = Math.min(100, g.saved / g.target * 100);
    const done = g.saved >= g.target;
    return `<section class="card" aria-label="${esc(g.name)}">
      <div class="goal-head"><h2>${esc(g.name)}</h2><span class="amount">${idr(g.saved)} <span class="muted small">/ ${idr(g.target)}</span></span></div>
      <div class="bar-track" style="margin:10px 0 6px"><span class="bar-fill" style="display:block;width:${width.toFixed(1)}%"></span></div>
      <p class="small">${pct(g.saved, g.target)} tercapai &middot; sisa ${idr(left)} &middot; iuran ${idr(g.monthly)}/bulan &middot; ${done ? 'Target tercapai!' : 'diperkirakan selesai ' + finishMonth(left, g.monthly)}</p>
      <p class="small muted">${esc(g.note)}</p>
      <div class="addfunds">
        <input type="number" min="1000" step="1000" value="100000" data-funds-input="${i}" aria-label="Jumlah dana untuk ${esc(g.name)}">
        <button class="small" data-funds-add="${i}">Tambah dana</button>
      </div>
    </section>`;
  }).join('');

  return `
  <h1>Tabungan &amp; tujuan</h1>
  <p class="lede">Tiga tujuan keluarga ini. Total yang sudah terkumpul <strong>${idr(state.goals.reduce((s, g) => s + g.saved, 0))}</strong> dari target gabungan <strong>${idr(state.goals.reduce((s, g) => s + g.target, 0))}</strong>. Perkiraan selesai dihitung dari iuran bulanan masing-masing tujuan, mulai ${esc(HOUSEHOLD.month)}.</p>
  ${sampleNote()}
  <div class="grid" style="gap:16px">${cards}</div>`;
}

// ---- Tips -----------------------------------------------------------------

export function tipsView(state) {
  const income = totalIncome();
  const spent = totalSpent(state.transactions);
  const saved = totalSaved(state.transactions);
  const totals = categoryTotals(state.transactions).filter((c) => c.id !== SAVINGS_ID);
  const eating = totals.find((c) => c.id === 'eating');
  const groceries = totals.find((c) => c.id === 'groceries');
  const top = [...totals].sort((a, b) => b.spent - a.spent)[0];

  const tips = [
    {
      title: 'Pakai aturan 50/30/20 sebagai patokan, bukan hukum',
      body: `Bulan ini kebutuhan pokok keluarga Wijaya sekitar ${idr(spent - eating.spent - totals.find((c) => c.id === 'entertainment').spent - totals.find((c) => c.id === 'shopping').spent)} dari ${idr(spent)} belanja, keinginan (makan di luar, hiburan, belanja barang) ${idr(eating.spent + totals.find((c) => c.id === 'entertainment').spent + totals.find((c) => c.id === 'shopping').spent)}, dan tabungan ${idr(saved)} — tingkat tabungan ${pct(saved, income)} dari pemasukan ${idr(income)}. Kalau tabunganmu di bawah 10%, potong dulu dari keinginan, bukan dari kebutuhan pokok.`,
    },
    {
      title: 'Makan di luar adalah tuas paling cepat',
      body: `Makan di luar bulan ini ${idr(eating.spent)} — ${pct(eating.spent, spent)} dari seluruh belanja. Masak 3 makan malam lagi dalam seminggu menggantikan warteg dan restoran menghemat kira-kira Rp 450 ribu sebulan untuk keluarga ini, tanpa mengubah belanja harian ${idr(groceries.spent)} yang justru paling besar dan paling sulit dipotong.`,
    },
    {
      title: 'Bayar tagihan tetap di awal bulan',
      body: `Tagihan tetap — listrik, air, internet, SPP, dan les — dibayar tanggal 1–10 dan totalnya sudah pasti. Sisihkan dulu di tanggal 1, baru belanja sisanya. Di contoh ini ${top.name} adalah kategori belanja terbesar (${idr(top.spent)}), jadi pantau kategori itu setiap minggu, bukan setiap hari.`,
    },
    {
      title: 'Metode amplop untuk kategori yang bocor',
      body: `Ambil uang tunai sebesar anggaran kategori yang sering kebablasan — misalnya makan di luar ${idr(eating.spent)} bulan ini — dan masukkan ke amplop. Kalau amplop kosong sebelum akhir bulan, itu tandanya, bukan kegagalan: pindahkan sisa dari kategori lain secara sadar di halaman Anggaran, jangan diam-diam memakai kartu.`,
    },
    {
      title: 'Baca grafik mingguan, bukan angka harian',
      body: `Belanja minggu 1 selalu paling besar karena tagihan tetap jatuh tempo di awal bulan. Bandingkan minggu ke minggu di halaman Ringkasan: satu hari boros tidak merusak bulan, tapi tiga minggu berturut-turut naik berarti anggaran atau kebiasaan yang harus diubah.`,
    },
    {
      title: 'Tabungan dulu, baru belanja',
      body: `Keluarga ini mentransfer ${idr(saved)} ke tabungan di tanggal 2, 10, dan 20 — sebelum uangnya sempat terpakai. Atur transfer otomatis di tanggal gajian dengan jumlah yang sama, lalu perlakukan sisanya sebagai uang belanja. Dana darurat mereka sudah ${pct(state.goals[0].saved, state.goals[0].target)} dari target ${idr(state.goals[0].target)}.`,
    },
  ];

  return `
  <h1>Tips mengatur uang rumah tangga</h1>
  <p class="lede">Enam kebiasaan yang dipakai keluarga contoh ini — setiap tips merujuk ke angka nyata dari anggaran mereka di atas, bukan nasihat umum.</p>
  ${sampleNote()}
  ${tips.map((t) => `<div class="tip"><h3>${esc(t.title)}</h3><p>${t.body}</p></div>`).join('')}
  <p><a class="backlink" href="#/">&larr; Kembali ke Ringkasan</a></p>`;
}
