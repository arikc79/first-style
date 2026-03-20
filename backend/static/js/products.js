// ── ТОВАРИ (дані з API /api/products/) ──
let allProducts = [];

async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '<p style="color:var(--grey);text-align:center;padding:60px 0">Завантаження…</p>';

  try {
    const res = await fetch('/api/products/');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    allProducts = await res.json();
    renderProducts('all');
  } catch (err) {
    console.error('Помилка завантаження товарів:', err);
    grid.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--grey)">
        <div style="font-size:48px;margin-bottom:16px">⚠️</div>
        <p>Не вдалось завантажити товари.<br>Перевірте з'єднання і оновіть сторінку.</p>
      </div>`;
  }
}

// ── РЕНДЕР КАРТОК ──
function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === filter);

  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--grey);text-align:center;padding:40px 0">Товарів не знайдено</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card fade-in" onclick="openModal(${p.id})">
      <div class="product-img">
        <span>${p.emoji}</span>
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-cat">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description.substring(0, 80)}…</div>
        <div class="product-footer">
          <div class="product-price">
            ${p.old_price ? `<span>${p.old_price.toLocaleString('uk-UA')} ₴</span>` : ''}
            ${p.price.toLocaleString('uk-UA')} ₴
          </div>
          <button class="add-cart-btn" onclick="event.stopPropagation();quickAdd(${p.id})">+ Кошик</button>
        </div>
      </div>
    </div>`).join('');

  observeFadeIns();
}

// ── ФІЛЬТР ──
function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ── ПЕРЕХІД З КАТЕГОРІЙ ──
function goToProducts(cat) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
    if (b.textContent.trim() === cat) b.classList.add('active');
  });
  renderProducts(cat);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ── ШВИДКЕ ДОДАВАННЯ ──
function quickAdd(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  addItem(p, p.sizes[0]);
  showToast('✓ ' + p.name + ' — додано до кошика');
}

// ── СТАРТ ──
loadProducts();

