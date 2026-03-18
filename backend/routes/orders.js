// POST /api/orders — прийняти нове замовлення
// TODO: підключити Supabase та Make.com

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, delivery, city, branch, payment, items, total } = req.body;

    // Валідація
    if (!firstName || !phone || !items?.length) {
      return res.status(400).json({ error: 'Відсутні обов'язкові поля' });
    }

    // TODO: зберегти в Supabase
    // const { data, error } = await supabase.from('orders').insert({...})

    // TODO: відправити в Make.com webhook
    // await fetch(process.env.MAKE_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(order) })

    res.json({ success: true, message: 'Замовлення прийнято' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
