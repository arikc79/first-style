// GET /api/products — отримати список товарів
// TODO: підключити Supabase

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    // TODO: отримати з Supabase
    // const { data, error } = await supabase.from('products').select('*')
    //   .eq(category ? 'category' : 'id', category || undefined)

    // Поки повертаємо заглушку
    res.json({ products: [], message: 'TODO: підключити Supabase' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
