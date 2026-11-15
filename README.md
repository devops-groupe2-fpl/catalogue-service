# Service Catalogue

Microservice Catalogue et frontend statique du projet DevOps II — Groupe 2.

## Avancement d’Ouzziki

### Tâches terminées

- Schéma PostgreSQL du catalogue dans `db/schema.sql`.
- Données de test du catalogue dans `db/seed.sql`.
- API Express avec les routes suivantes :
  - `GET /health`
  - `GET /products`
  - `GET /products/:id`
- Connexion à PostgreSQL avec la variable d’environnement `DATABASE_URL`.
- Gestion des codes HTTP : réponses réussies, produit absent (`404`) et erreurs de base de données (`500`).
- Frontend statique avec trois pages :
  - `frontend/html/index.html` : catalogue des produits ;
  - `frontend/html/cart.html` : panier ;
  - `frontend/html/history.html` : historique des commandes.
- Style responsive et professionnel dans `frontend/html/css/style.css`.
- URLs relatives du frontend préparées pour l’Ingress du groupe (`/api/...`).
- Configuration Nginx dans `frontend/nginx.conf`.
- Documentation de l’avancement dans ce fichier `README.md`.

### Vérifications effectuées

- Vérification de la syntaxe JavaScript réussie.
- La route `GET /health` retourne `200 OK`.
- L’API Catalogue est prête à être testée avec PostgreSQL et Docker.
- Les modifications sont poussées sur la branche `feature/ouzziki/schema-catalogue`.

### Travail restant

- Ajouter les tests unitaires Jest/Supertest de l’API Catalogue.
- Ajouter les Dockerfiles du Catalogue et du Frontend.
- Ajouter les pipelines Jenkins du Catalogue et du Frontend.
- Compléter le versioning, les tags de release et le changelog.
- Créer la Pull Request finale après la revue du groupe.

## ⚠️ Dépendances avec les autres services

> [!IMPORTANT]
> **L’API Catalogue est indépendante.** Elle peut être développée et testée séparément, sans attendre les autres services.

### Intégration du frontend

L’intégration complète du frontend nécessite encore les éléments suivants :

| Membre | Élément nécessaire | État |
|---|---|---|
| **Zineb — Panier** | `/api/panier/cart/:userId` et les actions du panier | En attente de l’intégration |
| **Hasna — Commandes** | `/api/commandes/orders/:userId` et la validation de commande | En attente du service Commandes |
| **Zakaria — Infrastructure** | Routage Kubernetes Ingress pour `/api/...` | En attente de l’Ingress |

> [!NOTE]
> Le frontend utilise temporairement `user1` comme identifiant utilisateur, en attendant la mise en place de l’authentification.

## Prérequis

- Node.js 18 ou une version plus récente ;
- npm ;
- Docker, pour PostgreSQL et les futurs tests des conteneurs.

## Lancer l’API Catalogue localement

Démarrer PostgreSQL avec Docker :

```bash
docker run --name catalogue-postgres \
  -e POSTGRES_DB=catalogue \
  -e POSTGRES_USER=catalogue \
  -e POSTGRES_PASSWORD=catalogue \
  -p 5433:5432 \
  -d postgres:16-alpine
```

Créer le schéma et ajouter les données de test :

```bash
docker exec -i catalogue-postgres psql -U catalogue -d catalogue < db/schema.sql
docker exec -i catalogue-postgres psql -U catalogue -d catalogue < db/seed.sql
```

Installer les dépendances et démarrer le service :

```bash
npm install
export DATABASE_URL=postgresql://catalogue:catalogue@localhost:5433/catalogue
export PORT=3000
npm start
```

Tester l’API :

```bash
curl http://localhost:3000/health
curl http://localhost:3000/products
curl http://localhost:3000/products/1
```

## Lancer le frontend localement

Dans un deuxième terminal :

```bash
cd frontend/html
python3 -m http.server 8080
```

Ouvrir ensuite :

```text
http://localhost:8080/index.html
http://localhost:8080/cart.html
http://localhost:8080/history.html
```

Les pages peuvent déjà être vérifiées visuellement. L’intégration complète des URLs `/api/...` nécessite l’Ingress du groupe ou un proxy inverse local.

## Format de réponse de l’API

Chaque produit est retourné avec le format utilisé par le frontend :

```json
{
  "id": 1,
  "name": "Laptop Pro 14",
  "price": 1299.99,
  "description": "Ordinateur portable pour un usage professionnel.",
  "stock": 12,
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

La colonne `created_at` de la base de données est convertie en `createdAt` par l’API.
