// main.js — router, state, and wiring. The site is a hash-routed single page:
// #/ overview, #/budget, #/transactions, #/bills, #/goals, #/tips.
// State lives in memory and, when the browser allows it, in localStorage;
// if storage is unavailable the site keeps working in memory only.

import { CATEGORIES, TRANSACTIONS, BILLS, GOALS } from './data.js';
import { overviewView, budgetView, transactionsView, billsView, goalsView, tipsView } from './views.js';

const STORAGE_KEY = 'dompetkeluarga-v1';

function loadStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveStored(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions: state.transactions,
      budgets: state.budgets,
      bills: state.bills,
      goals: state.goals,
    }));
  } catch {
    // Storage unavailable (private mode, blocked, full): in-memory only.
  }
}

const stored = loadStored();
const state = {
  transactions: stored ? stored.transactions : TRANSACTIONS.map((t) => ({ ...t })),
  budgets: stored ? stored.budgets : Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
  bills: stored ? stored.bills : BILLS.map((b) => ({ ...b })),
  goals: stored ? stored.goals : GOALS.map((g) => ({ ...g })),
};

// Filter/search/sort for the transactions page; kept outside `state` because
// it is view state, not household data, and is not persisted.
const txUi = { filter: 'all', search: '', sort: 'date-desc' };

const app = document.getElementById('app');

const ROUTES = {
  '': { view: overviewView, nav: 'overview' },
  'budget': { view: budgetView, nav: 'budget' },
  'transactions': { view: transactionsView, nav: 'transactions' },
  'bills': { view: billsView, nav: 'bills' },
  'goals': { view: goalsView, nav: 'goals' },
  'tips': { view: tipsView, nav: 'tips' },
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES[hash] ? hash : '';
}

function render() {
  const route = currentRoute();
  const page = ROUTES[route];
  app.innerHTML = page.view(state, txUi);
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === page.nav);
  });
  wire(route);
  window.scrollTo(0, 0);
}

function rerender() {
  saveStored(state);
  render();
}

function wire(route) {
  if (route === 'budget') {
    app.querySelectorAll('[data-budget-save]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.budgetSave;
        const input = app.querySelector(`[data-budget-input="${id}"]`);
        const value = Math.max(0, Math.round(Number(input.value) || 0));
        state.budgets[id] = value;
        rerender();
      });
    });
  }

  if (route === 'transactions') {
    const filter = app.querySelector('[data-filter]');
    const search = app.querySelector('[data-search]');
    const sort = app.querySelector('[data-sort]');
    if (filter) filter.addEventListener('change', () => { txUi.filter = filter.value; render(); });
    if (search) search.addEventListener('input', () => { txUi.search = search.value; render(); });
    if (sort) sort.addEventListener('change', () => { txUi.sort = sort.value; render(); });
    // Keep the caret in the search box after a re-render.
    if (search && document.activeElement !== search && txUi.search) {
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
    }
    const form = app.querySelector('[data-add-form]');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const day = Math.min(30, Math.max(1, Number(data.get('day')) || 26));
        const desc = String(data.get('desc') || '').trim().slice(0, 80);
        const cat = String(data.get('cat') || 'groceries');
        const amount = Math.max(0, Math.round(Number(data.get('amount')) || 0));
        const note = app.querySelector('[data-add-note]');
        if (!desc || amount <= 0 || !CATEGORIES.some((c) => c.id === cat)) {
          if (note) note.textContent = 'Isi keterangan dan jumlah yang benar (jumlah di atas Rp 0) lalu coba lagi.';
          return;
        }
        state.transactions.push({ day, desc, cat, amount });
        txUi.filter = 'all';
        txUi.search = '';
        txUi.sort = 'date-desc';
        rerender();
        const updated = app.querySelector('[data-add-note]');
        if (updated) updated.textContent = 'Ditambahkan: ' + desc + ' — ' + amount + ' rupiah. Total di atas sudah termasuk transaksi baru ini.';
      });
    }
  }

  if (route === 'bills') {
    app.querySelectorAll('[data-bill-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.billToggle);
        state.bills[index].paid = !state.bills[index].paid;
        rerender();
      });
    });
  }

  if (route === 'goals') {
    app.querySelectorAll('[data-funds-add]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.fundsAdd);
        const input = app.querySelector(`[data-funds-input="${index}"]`);
        const value = Math.max(0, Math.round(Number(input.value) || 0));
        if (value > 0) {
          state.goals[index].saved += value;
          rerender();
        }
      });
    });
  }
}

window.addEventListener('hashchange', render);
render();
