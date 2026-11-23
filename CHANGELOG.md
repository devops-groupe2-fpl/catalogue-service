# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [v1.0.0] - 2026-11-23
### Ajouté
- API REST Catalogue : `GET /health`, `GET /products`, `GET /products/:id` avec gestion 200/404/500
- Schéma PostgreSQL `products` (BIGSERIAL, CHECK price/stock, index created_at) + seed 3 produits
- Frontend statique 3 pages : catalogue, panier, historique + style responsive + URLs relatives /api/...
- nginx.conf pour servir le frontend
- Tests unitaires Jest/Supertest (10 tests, >80% couverture) — mock DB, cas vide, données, 404, 500
- Dockerfile multi-stage Catalogue (node:22-alpine → alpine:3.22, <150MB, HEALTHCHECK, non-root user)
- Dockerfile Frontend (nginx:1.27-alpine, HEALTHCHECK)
- .dockerignore optimisés
- Jenkinsfile Catalogue : Build → Test → Push → Deploy (pipeline indépendant)
- Jenkinsfile Frontend : Build → Test smoke → Push → Deploy (pipeline indépendant)
- Documentation README complète + dépendances inter-services

### Corrigé
- Conversion `id` BIGINT string → Number (fix `toProduct`)

## [v1.0.1] - À venir
- Pagination `GET /products?page=1&limit=10`
- Filtrage par prix/stock

## [v2.0.0] - À venir (démo)
- Démonstration déploiement indépendant : `catalogue:v2` sans redémarrer panier/commandes
