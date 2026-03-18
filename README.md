# FIRST — Premium Men's Clothing

Інтернет-магазин чоловічого одягу. Вінниця, Україна.

## Стек
- **Frontend:** HTML / CSS / JavaScript
- **Backend:** Node.js / Python
- **Database:** Supabase (PostgreSQL)
- **Automation:** Make.com
- **Hosting:** Vercel

## Структура
```
first-style/
├── frontend/     ← Верстка (Тар)
├── backend/      ← API сервер
├── database/     ← Схема БД
└── automation/   ← Make.com сценарії
```

## Команда

| Роль | Зона | Гілка |
|------|------|-------|
| Frontend | `frontend/` | `feature/frontend` |
| Backend | `backend/` | `feature/backend` |
| Database | `database/` | `feature/database` |
| Automation | `automation/` | `feature/automation` |

## Гілки
```
main              ← тільки продакшн (не пушити напряму!)
dev               ← загальна розробка
feature/frontend
feature/backend
feature/database
feature/automation
```

## Як почати

```bash
git clone https://github.com/YOUR_USERNAME/first-style.git
cd first-style
git checkout dev
git checkout -b feature/твоя-роль
# ... пишеш код ...
git add .
git commit -m "feat: опис змін"
git push origin feature/твоя-роль
# Потім Pull Request → dev
```

## Правила команди
- ❌ Не пушити напряму в `main`
- ✅ Кожна задача — окремий PR
- ✅ Commit формат: `feat:`, `fix:`, `docs:`, `style:`
