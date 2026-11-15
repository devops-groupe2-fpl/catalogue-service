-- Sample catalogue data for local development and tests.

INSERT INTO products (id, name, price, description, stock, created_at)
VALUES
    (1, 'Laptop Pro 14', 1299.99, 'Portable laptop for professional use.', 12, '2026-01-15T10:00:00Z'),
    (2, 'Wireless Headphones', 89.90, 'Noise-cancelling wireless headphones.', 35, '2026-01-16T10:30:00Z'),
    (3, 'USB-C Hub', 39.50, 'Multi-port USB-C hub with HDMI and USB 3.0.', 50, '2026-01-17T14:15:00Z')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    stock = EXCLUDED.stock,
    created_at = EXCLUDED.created_at;

-- Keep the BIGSERIAL sequence above the explicit seed identifiers.
SELECT setval(
    pg_get_serial_sequence('products', 'id'),
    COALESCE((SELECT MAX(id) FROM products), 1),
    true
);
