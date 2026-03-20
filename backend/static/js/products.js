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

// ── CAROUSEL STATE ──
const carouselState = {}; // { productId: currentIndex }

function buildCardMedia(p) {
  const imgs = p.images || [];

  if (!imgs.length) return `<span>${p.emoji}</span>`;

  if (imgs.length === 1) {
    return `<img src="${imgs[0].image_url}" alt="${p.name}"
              style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`;
  }

  // Кілька фото — карусель
  carouselState[p.id] = 0;
  return `
    <div class="product-carousel" data-pid="${p.id}">
      ${imgs.map((img, i) => `
        <img src="${img.image_url}" alt="${p.name}" class="${i === 0 ? 'active' : ''}">
      `).join('')}
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
        ${buildCardMedia(p)}
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
          <button class="add-cart-btn"
            onclick="event.stopPropagation();quickAdd(${p.id})">+ Кошик</button>
        </div>
      </div>
    </div>`).join('');

  initCarouselSwipe();
  observeFadeIns();
}

// ── НАВІГАЦІЯ КАРУСЕЛІ ──
function carouselNav(pid, dir) {
  const carousel = document.querySelector(`.product-carousel[data-pid="${pid}"]`);
  if (!carousel) return;
  const imgs = carousel.querySelectorAll('img');
  const dots = carousel.closest('.product-img').querySelectorAll('.carousel-dot');
  let idx = carouselState[pid] || 0;

  imgs[idx].classList.remove('active');
  dots[idx]?.classList.remove('active');

  idx = (idx + dir + imgs.length) % imgs.length;
  carouselState[pid] = idx;

  imgs[idx].classList.add('active');
  dots[idx]?.classList.add('active');
}

function carouselGo(pid, idx) {
  const carousel = document.querySelector(`.product-carousel[data-pid="${pid}"]`);
  if (!carousel) return;
  const imgs = carousel.querySelectorAll('img');
  const dots = carousel.closest('.product-img').querySelectorAll('.carousel-dot');
  const cur  = carouselState[pid] || 0;

  imgs[cur].classList.remove('active');
  dots[cur]?.classList.remove('active');
  imgs[idx].classList.add('active');
  dots[idx]?.classList.add('active');
  carouselState[pid] = idx;
}

// ── SWIPE (мобільний) ──
function initCarouselSwipe() {
  document.querySelectorAll('.product-carousel').forEach(el => {
    let startX = 0;
    el.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) carouselNav(Number(el.dataset.pid), diff > 0 ? 1 : -1);
    });
  });
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
