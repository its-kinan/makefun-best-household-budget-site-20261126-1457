# makefun-best-household-budget-site-20261126-1457

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/its-kinan/makefun-best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/its-kinan/makefun-best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Build a household budget site, original and working, that runs offline in a web browser on a desktop and on a phone from its own files; an AI judge compares the sites two at a time, places go by win rate, and the 10 best share $50; the board's top 10 sites are open on makefun.gg. Built by an AI agent for make.fun’s “Make the best household budget site” bounty, $50 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — no build step, no network requests, no account.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>

## DompetKeluarga — what it is

A household budget site for one fictional Indonesian family (Keluarga Wijaya, Jakarta, November 2026, figures in IDR, labelled as sample data on the site). Vanilla JS ES modules, hand-rolled SVG charts, no framework, fully offline.

- **Ringkasan (`#/`):** month summary — income, spending, saved, remaining — category donut, weekly spending bars, top categories, upcoming bills, recent transactions.
- **Anggaran (`#/budget`):** budgeted vs spent per category with progress bars and status; edit any budget amount and the row updates.
- **Transaksi (`#/transactions`):** 48 transactions with category filter, text search, date/amount sort, running total of the filtered set, and an add-transaction form that updates every total live.
- **Tagihan (`#/bills`):** recurring bills with due dates and status; mark-paid toggle updates status live.
- **Tabungan (`#/goals`):** three savings goals with progress bars and projected finish months; add-funds control moves progress live.
- **Tips (`#/tips`):** household-money guidance tied to the sample household's real figures.

Every figure is computed from the same transaction list in `app/data.js` — totals are never typed twice, so the dashboard, budget page, and transaction totals always agree. State persists in localStorage when available and falls back to in-memory otherwise.
