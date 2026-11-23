const express = require('express');
const pool = require('../db');

const router = express.Router();

function toProduct(row) {
  return {
    id: Number(row.id),
    name: row.name,
    price: Number(row.price),
    description: row.description,
    stock: row.stock,
    createdAt: row.created_at,
  };
}

// GET /products - return the complete product list.
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, price, description, stock, created_at
      FROM products
      ORDER BY id ASC
    `);

    return res.status(200).json(result.rows.map(toProduct));
  } catch (error) {
    console.error('Unable to fetch products:', error.message);
    return res.status(500).json({ error: 'Unable to retrieve products' });
  }
});

// GET /products/:id - return one product or 404 when it does not exist.
router.get('/:id', async (req, res) => {
  const productId = Number(req.params.id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(404).json({ error: 'Product not found' });
  }

  try {
    const result = await pool.query(`
      SELECT id, name, price, description, stock, created_at
      FROM products
      WHERE id = $1
    `, [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(toProduct(result.rows[0]));
  } catch (error) {
    console.error('Unable to fetch product:', error.message);
    return res.status(500).json({ error: 'Unable to retrieve product' });
  }
});

module.exports = router;
