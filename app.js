// ── ESTADO ───────────────────────────────────────
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const CATEGORIES = {
  alimentacion:   { label: 'Alimentación',   emoji: '🛒', color: '#e67e22' },
  transporte:     { label: 'Transporte',      emoji: '🚌', color: '#3498db' },
  vivienda:       { label: 'Vivienda',        emoji: '🏠', color: '#9b59b6' },
  salud:          { label: 'Salud',           emoji: '💊', color: '#e74c3c' },
  entretenimiento:{ label: 'Entretenimiento', emoji: '🎮', color: '#1abc9c' },
  ropa:           { label: 'Ropa',            emoji: '👗', color: '#f39c12' },
  educacion:      { label: 'Educación',       emoji: '📚', color: '#2980b9' },
  servicios:      { label: 'Servicios',       emoji: '💡', color: '#7f8c8d' },
  otro:           { label: 'Otro',            emoji: '📦', color: '#95a5a6' },
  ingreso:        { label: 'Ingreso',         emoji: '💰', color: '#1a7a4a' },
};

let currentYear, currentMonth;
let transactions = [];
let currentType = 'expense';
let currentFilter = 'all';

// ── INIT ──────────────────────────────────────────
function init() {
  const now = new Date();
  currentYear  = now.getFullYear();
  currentMonth = now.getMonth();

  // Set today's date as default
  document.getElementById('date-input').valueAsDate = now;

  loadTransactions();
  renderAll();
  bindEvents();
}

// ── STORAGE ───────────────────────────────────────
function storageKey() {
  return `budgetwise_${currentYear}_${currentMonth}`;
}

function loadTransactions() {
  try {
    transactions = JSON.parse(localStorage.getItem(storageKey())) || [];
  } catch { transactions = []; }
}

function saveTransactions() {
  localStorage.setItem(storageKey(), JSON.stringify(transactions));
}

// ── EVENTS ────────────────────────────────────────
function bindEvents() {
  // Month navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    loadTransactions(); renderAll();
  });
  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    loadTransactions(); renderAll();
  });

  // Type tabs
  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentType = tab.dataset.type;
      document.querySelectorAll('.type-tab').forEach(t => {
        t.classList.remove('active', 'expense', 'income');
      });
      tab.classList.add('active', currentType);
      document.getElementById('category-field').style.display =
        currentType === 'expense' ? 'block' : 'none';
    });
  });

  // Add button
  document.getElementById('btn-add').addEventListener('click', addTransaction);

  // Enter key
  document.getElementById('desc-input').addEventListener('keydown', e => { if (e.key === 'Enter') addTransaction(); });
  document.getElementById('amount-input').addEventListener('keydown', e => { if (e.key === 'Enter') addTransaction(); });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderList();
    });
  });

  // Clear month
  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm(`¿Limpiar todas las transacciones de ${MONTHS[currentMonth]} ${currentYear}?`)) {
      transactions = [];
      saveTransactions();
      renderAll();
    }
  });

  // Init tab style
  document.querySelector('.type-tab.active').classList.add('expense');
}

// ── ADD TRANSACTION ───────────────────────────────
function addTransaction() {
  const desc   = document.getElementById('desc-input').value.trim();
  const amount = parseFloat(document.getElementById('amount-input').value);
  const cat    = document.getElementById('category-input').value;
  const date   = document.getElementById('date-input').value;

  if (!desc)         return shake('desc-input');
  if (!amount || amount <= 0) return shake('amount-input');
  if (!date)         return shake('date-input');

  transactions.push({
    id:       Date.now(),
    type:     currentType,
    desc,
    amount,
    category: currentType === 'expense' ? cat : 'ingreso',
    date,
  });

  saveTransactions();
  renderAll();

  // Reset form
  document.getElementById('desc-input').value   = '';
  document.getElementById('amount-input').value = '';
  document.getElementById('desc-input').focus();
}

function shake(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#c0392b';
  el.style.animation = 'none';
  requestAnimationFrame(() => {
    el.style.animation = 'shake 0.35s ease';
  });
  setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 600);
}

// Inject shake keyframe
const style = document.createElement('style');
style.textContent = `@keyframes shake { 0%,100%{transform:none} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }`;
document.head.appendChild(style);

// ── DELETE ────────────────────────────────────────
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  renderAll();
}

// ── RENDER ALL ────────────────────────────────────
function renderAll() {
  renderMonthLabel();
  renderSummary();
  renderProgress();
  renderChart();
  renderList();
}

// ── MONTH LABEL ───────────────────────────────────
function renderMonthLabel() {
  document.getElementById('month-label').textContent = `${MONTHS[currentMonth]} ${currentYear}`;
}

// ── SUMMARY ───────────────────────────────────────
function renderSummary() {
  const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance  = income - expenses;
  const rate     = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  document.getElementById('total-income').textContent   = fmt(income);
  document.getElementById('total-expenses').textContent = fmt(expenses);

  const balEl = document.getElementById('total-balance');
  balEl.textContent = fmt(balance);
  balEl.className = 'summary-value ' + (balance >= 0 ? 'positive' : 'negative');

  document.getElementById('savings-rate').textContent = rate + '%';
  document.getElementById('donut-total').textContent  = fmt(expenses);
}

// ── PROGRESS BAR ──────────────────────────────────
function renderProgress() {
  const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const pct      = income > 0 ? Math.min(Math.round((expenses / income) * 100), 100) : 0;

  document.getElementById('progress-pct').textContent = pct + '%';
  const fill = document.getElementById('progress-fill');
  fill.style.width = pct + '%';
  fill.className = 'progress-bar-fill' + (pct >= 90 ? ' danger' : pct >= 70 ? ' warning' : '');
}

// ── DONUT CHART ───────────────────────────────────
function renderChart() {
  const canvas = document.getElementById('donut-canvas');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const expenses = transactions.filter(t => t.type === 'expense');
  const legend   = document.getElementById('chart-legend');

  if (!expenses.length) {
    // Draw empty circle
    ctx.beginPath();
    ctx.arc(W/2, H/2, 72, 0, Math.PI * 2);
    ctx.strokeStyle = '#e8e4dc';
    ctx.lineWidth = 28;
    ctx.stroke();
    legend.innerHTML = '<div class="chart-empty">Sin gastos este mes</div>';
    return;
  }

  // Group by category
  const grouped = {};
  expenses.forEach(t => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount;
  });
  const total = Object.values(grouped).reduce((s, v) => s + v, 0);
  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  // Draw donut
  let startAngle = -Math.PI / 2;
  const cx = W / 2, cy = H / 2, R = 72, thickness = 28;

  entries.forEach(([cat, val]) => {
    const slice = (val / total) * Math.PI * 2;
    const color = CATEGORIES[cat]?.color || '#95a5a6';
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, startAngle + slice);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'butt';
    ctx.stroke();
    startAngle += slice;
  });

  // Gap between slices (redraw with tiny gaps)
  startAngle = -Math.PI / 2;
  entries.forEach(([cat, val]) => {
    const slice = (val / total) * Math.PI * 2;
    const gap = 0.03;
    const color = CATEGORIES[cat]?.color || '#95a5a6';
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle + gap/2, startAngle + slice - gap/2);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
    startAngle += slice;
  });

  // Legend
  legend.innerHTML = entries.slice(0, 6).map(([cat, val]) => {
    const info = CATEGORIES[cat] || { label: cat, color: '#95a5a6', emoji: '📦' };
    const pct  = Math.round((val / total) * 100);
    return `
      <div class="legend-item">
        <div class="legend-dot" style="background:${info.color}"></div>
        <span class="legend-name">${info.emoji} ${info.label}</span>
        <span class="legend-amount">${fmt(val)}</span>
        <span class="legend-pct">${pct}%</span>
      </div>`;
  }).join('');
}

// ── TRANSACTION LIST ──────────────────────────────
function renderList() {
  const list = document.getElementById('transaction-list');

  let filtered = [...transactions];
  if (currentFilter !== 'all') filtered = filtered.filter(t => t.type === currentFilter);
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◎</div>
        <p>${currentFilter === 'all' ? 'Sin transacciones este mes' : currentFilter === 'expense' ? 'Sin gastos este mes' : 'Sin ingresos este mes'}</p>
        <small>Agrega tu primera transacción</small>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map((t, i) => {
    const cat  = CATEGORIES[t.category] || { emoji: '📦', label: t.category };
    const sign = t.type === 'expense' ? '−' : '+';
    const dateStr = new Date(t.date + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
    return `
      <div class="tx-item ${t.type}" style="animation-delay:${i * 0.04}s">
        <div class="tx-icon">${cat.emoji}</div>
        <div class="tx-info">
          <div class="tx-desc">${escHtml(t.desc)}</div>
          <div class="tx-meta">${cat.label} · ${dateStr}</div>
        </div>
        <div class="tx-amount">${sign} ${fmt(t.amount)}</div>
        <button class="tx-delete" onclick="deleteTransaction(${t.id})" title="Eliminar">×</button>
      </div>`;
  }).join('');
}

// ── UTILS ─────────────────────────────────────────
function fmt(n) {
  return 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── START ─────────────────────────────────────────
init();