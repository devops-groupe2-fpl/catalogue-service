const express = require('express');
const productsRouter = require('./routes/products');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/products', productsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
