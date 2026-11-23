const request = require('supertest');

// Mock the DB pool before requiring app
jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

const app = require('../src/app');
const pool = require('../src/db');

describe('Catalogue API — GET /health', () => {
  test('should return 200 ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Catalogue API — GET /products', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET /products avec liste vide → 200 + []', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(pool.query).toHaveBeenCalled();
  });

  test('GET /products avec données → 200 + tableau', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        { id: '1', name: 'Laptop Pro 14', price: '1299.99', description: 'Portable', stock: 12, created_at: '2026-01-15T10:00:00.000Z' },
        { id: '2', name: 'Wireless Headphones', price: '89.90', description: 'Noise', stock: 35, created_at: '2026-01-16T10:30:00.000Z' },
      ],
    });
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    // Verify conversion: id and price become numbers
    expect(res.body[0]).toEqual({
      id: 1,
      name: 'Laptop Pro 14',
      price: 1299.99,
      description: 'Portable',
      stock: 12,
      createdAt: '2026-01-15T10:00:00.000Z',
    });
    expect(typeof res.body[0].id).toBe('number');
    expect(typeof res.body[0].price).toBe('number');
  });

  test('GET /products erreur DB → 500', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB down'));
    const res = await request(app).get('/products');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /products/:id existant → 200 + objet', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: '1', name: 'Laptop Pro 14', price: '1299.99', description: 'Portable', stock: 12, created_at: '2026-01-15T10:00:00.000Z' }],
    });
    const res = await request(app).get('/products/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe('Laptop Pro 14');
  });

  test('GET /products/:id inexistant → 404', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/products/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Product not found' });
  });

  test('GET /products/:id invalide (abc) → 404', async () => {
    const res = await request(app).get('/products/abc');
    expect(res.status).toBe(404);
    // Should not query DB for invalid id
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('GET /products/:id invalide (0, -1) → 404', async () => {
    const res0 = await request(app).get('/products/0');
    expect(res0.status).toBe(404);
    const resNeg = await request(app).get('/products/-1');
    expect(resNeg.status).toBe(404);
  });

  test('GET /products/:id erreur DB → 500', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB down'));
    const res = await request(app).get('/products/1');
    expect(res.status).toBe(500);
  });

  test('Route inconnue → 404', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Route not found' });
  });
});
