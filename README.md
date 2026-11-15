# Catalogue Service

Catalogue microservice and static frontend for the DevOps II Group 2 project.

## Ouzziki progress

### Completed

- PostgreSQL catalogue schema in `db/schema.sql`.
- Catalogue seed data in `db/seed.sql`.
- Express API with:
  - `GET /health`
  - `GET /products`
  - `GET /products/:id`
- PostgreSQL access through the `DATABASE_URL` environment variable.
- HTTP status handling for successful responses, missing products (`404`) and database errors (`500`).
- Static frontend with three pages:
  - `frontend/html/index.html`: product catalogue;
  - `frontend/html/cart.html`: shopping cart;
  - `frontend/html/history.html`: order history.
- Responsive and professional CSS styling in `frontend/html/css/style.css`.
- Relative frontend API URLs prepared for the group Ingress (`/api/...`).
- Frontend Nginx configuration in `frontend/nginx.conf`.

### Validation completed

- JavaScript syntax checks passed.
- `GET /health` returned `200 OK`.
- Catalogue API was prepared for testing with PostgreSQL and Docker.
- Changes are pushed to the branch `feature/ouzziki/schema-catalogue`.

### Remaining work

- Add Jest/Supertest unit tests for the Catalogue API.
- Add the Catalogue and Frontend Dockerfiles.
- Add Jenkins pipelines for Catalogue and Frontend.
- Complete versioning, release tags and changelog.
- Create the final Pull Request after group review.

## Dependencies with the other services

The Catalogue API is independent and can be developed and tested separately.

The frontend is ready, but full integration depends on:

- **Zineb / Panier**: `/api/panier/cart/:userId` and cart actions;
- **Hasna / Commandes**: `/api/commandes/orders/:userId` and checkout;
- **Zakaria / Infrastructure**: Kubernetes Ingress routing for `/api/...`.

The frontend currently uses `user1` as the temporary user identifier.

## Prerequisites

- Node.js 18 or newer;
- npm;
- Docker, for PostgreSQL and later container tests.

## Run the Catalogue API locally

Start PostgreSQL with Docker:

```bash
docker run --name catalogue-postgres \
  -e POSTGRES_DB=catalogue \
  -e POSTGRES_USER=catalogue \
  -e POSTGRES_PASSWORD=catalogue \
  -p 5433:5432 \
  -d postgres:16-alpine
```

Create the schema and sample data:

```bash
docker exec -i catalogue-postgres psql -U catalogue -d catalogue < db/schema.sql
docker exec -i catalogue-postgres psql -U catalogue -d catalogue < db/seed.sql
```

Install dependencies and start the service:

```bash
npm install
export DATABASE_URL=postgresql://catalogue:catalogue@localhost:5433/catalogue
export PORT=3000
npm start
```

Test the API:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/products
curl http://localhost:3000/products/1
```

## Run the frontend locally

In a second terminal:

```bash
cd frontend/html
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/index.html
http://localhost:8080/cart.html
http://localhost:8080/history.html
```

The pages can be checked visually now. Full `/api/...` integration requires the group Ingress or a local reverse proxy.

## API response format

Each product is returned using the frontend-friendly format:

```json
{
  "id": 1,
  "name": "Laptop Pro 14",
  "price": 1299.99,
  "description": "Portable laptop for professional use.",
  "stock": 12,
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

The database column `created_at` is mapped to `createdAt` by the API.
