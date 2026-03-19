# Frontend — VAREL

Зона відповідальності: **Frontend Lead**

## Структура

```
frontend/
├── index.html       ← головна сторінка (вся верстка)
├── css/
│   ├── main.css     ← змінні, reset, типографіка, nav, footer
│   ├── hero.css     ← hero секція
│   ├── products.css ← каталог, картки товарів, фільтри
│   ├── cart.css     ← кошик сайдбар
│   └── checkout.css ← форма оформлення
├── js/
│   ├── products.js  ← дані товарів + рендер карток
│   ├── cart.js      ← логіка кошика
│   ├── checkout.js  ← оформлення замовлення
│   └── ui.js        ← модалки, toast, анімації, скрол
└── assets/
    └── hero.jpg     ← фото для hero
```

## Запуск локально

Просто відкрий `index.html` у браузері.  
Або через Live Server у VS Code.

## Підключення до API

Коли backend буде готовий — у `js/products.js` замінити:
```js
// Зараз: статичні дані
const products = [ ... ]

// Буде: fetch з API
const res = await fetch('/api/products')
const products = await res.json()
```
