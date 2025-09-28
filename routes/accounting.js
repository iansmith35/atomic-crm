const { Router } = require('express');
const { createCustomer, createInvoice, recordPayment, getPNLSummary, computeVAT } = require('../modules/accounting');

const router = Router();

router.post('/customer', async (req, res) => {
  try {
    const c = await createCustomer(req.body);
    res.json(c);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/invoice', async (req, res) => {
  try {
    const inv = await createInvoice(req.body);
    res.json(inv);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/payment', async (req, res) => {
  try {
    const p = await recordPayment(req.body);
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/pnl', async (req, res) => {
  const { start, end } = req.query;
  try {
    const s = await getPNLSummary(start, end);
    res.json(s);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/vat', async (req, res) => {
  const { start, end } = req.query;
  try {
    const v = await computeVAT(start, end);
    res.json(v);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;