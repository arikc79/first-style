// ── ТОВАРИ (дані з API /api/products/) ──
let allProducts = [];

// ── CAROUSEL STATE { productId: currentIndex } ──
const carouselState = {};

// ─────────────────────────────────────────────
// КАТЕГОРІЇ (динамічні з API)
// ─────────────────────────────────────────────
async function loadCategories() {
  try {
    const res = await fetch('/api/categories/');
    if (!res.ok) return;
    const cats = await res.json();
    renderCategoryCards(cats);
    renderFilterButtons(cats);
  } catch (e) {
    console.error('Категорії:', e);
  }
}

function renderCategoryCards(cats) {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = cats.map(c => `
    <div class="cat-card" onclick="goToProducts('${c.name}')">
      <div class="cat-img">${c.emoji}</div>
      <div class="cat-overlay">
        <div class="cat-name">${c.name}</div>
        <div class="cat-count">${c.product_count} товарів</div>
      </div>
    </div>`).join('');
}

function renderFilterButtons(cats) {
  const bar = document.getElementById('filtersBar');
  if (!bar) return;
  bar.innerHTML =
    `<button class="filter-btn active" onclick="filterProducts('all',this)">Всі</button>` +
    cats.map(c =>
      `<button class="filter-btn" onclick="filterProducts('${c.name}',this)">${c.name}</button>`
    ).join('');
}

// ─────────────────────────────────────────────
// ПРОДУКТИ
// ─────────────────────────────────────────────
async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '<p style="color:var(--grey);text-align:center;padding:60px 0">Завантаження…</p>';
  try {
    const res = await fetch('/api/products/');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    allProducts = await res.json();
    renderProducts('all');
  } catch (err) {
    console.error('Товари:', err);
    grid.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--grey)">
        <div style="font-size:48px;margin-bottom:16px">⚠️</div>
        <p>Не вдалось завантажити товари.</p>
      </div>`;
  }
}

// ── Медіа-блок картки ──
function buildCardMedia(p) {
  const imgs = p.images || [];

  // Немає фото — emoji, клік відкриває модалку
  if (!imgs.length) {
    return `<span style="font-size:64px;pointer-events:none">${p.emoji}</span>`;
  }

  // Одне фото — клік відкриває lightbox
  if (imgs.length === 1) {
    return `
      <div style="position:absolute;inset:0;cursor:zoom-in"
           onclick="event.stopPropagation();openLightbox(${p.id},0)">
        <img src="${imgs[0].image_url}" alt="${p.name}"
             style="width:100%;height:100%;object-fit:cover;pointer-events:none;">
      </div>`;
  }

  // Кілька фото — горизонтальний slider + lightbox по кліку
  carouselState[p.id] = 0;
  return `
    <div class="product-carousel" data-pid="${p.id}"
         onclick="event.stopPropagation();openLightbox(${p.id}, carouselState[${p.id}]||0)"
         style="cursor:zoom-in">
      <div class="carousel-track" id="ctrack-${p.id}">
        ${imgs.map(img =>
          `<img src="${img.image_url}" alt="${p.name}">`
        ).join('')}
      </div>
    </div>
    <button class="carousel-btn prev"
      onclick="event.stopPropagation();carouselNav(${p.id},-1)">&#8249;</button>
    <button class="carousel-btn next"
      onclick="event.stopPropagation();carouselNav(${p.id},1)">&#8250;</button>
    <div class="carousel-dots">
      ${imgs.map((_, i) => `
        <button class="carousel-dot ${i === 0 ? 'active' : ''}"
          onclick="event.stopPropagation();carouselGo(${p.id},${i})"></button>
      `).join('')}
    </div>`;
}

// ── Рендер карток ──
function renderProducts(filter) {
  const grid     = document.getElementById('productsGrid');
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
        ${buildCardMedia(p)}
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-cat">${p.category || '—'}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description.substring(0, 80)}…</div>
        <div class="product-footer">
          <div class="product-price">
            ${p.old_price ? `<span>${p.old_price.toLocaleString('uk-UA')} ₴</span>` : ''}
            ${p.price.toLocaleString('uk-UA')} ₴
          </div>
          <button class="add-cart-btn"
            onclick="event.stopPropagation();quickAdd(${p.id})">+ Кошик</button>
        </div>
      </div>
    </div>`).join('');

  initCarouselSwipe();
  observeFadeIns();
}

// ─────────────────────────────────────────────
// CAROUSEL: горизонтальний slide
// ─────────────────────────────────────────────
function carouselNav(pid, dir) {
  const track = document.getElementById(`ctrack-${pid}`);
  if (!track) return;
  const count = track.children.length;
  const dots  = track.closest('.product-img').querySelectorAll('.carousel-dot');
  let idx     = carouselState[pid] || 0;

  dots[idx]?.classList.remove('active');
  idx = (idx + dir + count) % count;
  carouselState[pid] = idx;

  track.style.transform = `translateX(-${idx * 100}%)`;
  dots[idx]?.classList.add('active');
}

function carouselGo(pid, idx) {
  const track = document.getElementById(`ctrack-${pid}`);
  if (!track) return;
  const dots = track.closest('.product-img').querySelectorAll('.carousel-dot');
  const cur  = carouselState[pid] || 0;

  dots[cur]?.classList.remove('active');
  track.style.transform = `translateX(-${idx * 100}%)`;
  dots[idx]?.classList.add('active');
  carouselState[pid] = idx;
}

// Touch swipe у картках
function initCarouselSwipe() {
  document.querySelectorAll('.product-carousel').forEach(el => {
    let sx = 0;
    el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      const diff = sx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) carouselNav(Number(el.dataset.pid), diff > 0 ? 1 : -1);
    });
  });
}

// ── Фільтр ──
function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ── Перехід з категорій ──
function goToProducts(cat) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
    if (b.textContent.trim() === cat) b.classList.add('active');
  });
  renderProducts(cat);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ── Швидке додавання ──
function quickAdd(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  addItem(p, p.sizes[0]);
  showToast('✓ ' + p.name + ' — додано до кошика');
}

// ── Старт ──
loadCategories();
loadProducts();
