# Service Catalogue

Microservice Catalogue et frontend statique du projet DevOps II — Groupe 2.

## Avancement d’Ouzziki — ✅ 10/10 TÂCHES TERMINÉES

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
- Configuration Nginx dans `frontend/nginx.conf` (gzip, cache, healthcheck).
- **Tests unitaires Jest/Supertest** dans `tests/products.test.js` — 10 tests, **100% couverture** (vide, données, 404, 500, route inconnue).
- **Dockerfile Catalogue** multi-stage `node:22-alpine → alpine:3.22` (<150MB, HEALTHCHECK, user non-root) dans `Dockerfile`.
- **.dockerignore** optimisé pour Catalogue et Frontend.
- **Dockerfile Frontend** `nginx:1.27-alpine` avec HEALTHCHECK dans `frontend/Dockerfile`.
- **Jenkinsfile Catalogue** : Build → Test → Push → Deploy (pipeline indépendant) dans `Jenkinsfile`.
- **Jenkinsfile Frontend** : Build → Test smoke → Push → Deploy (pipeline indépendant) dans `frontend/Jenkinsfile`.
- **Versioning** : tag `v1.0.0` + `CHANGELOG.md` + fix `id` BIGINT string → Number.
- Documentation de l’avancement dans ce fichier `README.md`.

### Vérifications effectuées

- Vérification de la syntaxe JavaScript réussie.
- La route `GET /health` retourne `200 OK`.
- `GET /products` retourne 3 produits, `GET /products/1` → 200, `GET /products/999` → 404.
- `npm test -- --coverage` → **10 PASS / 100%** Statements/Branches/Funcs/Lines.
- `docker build -t catalogue:test .` et `docker build --target test` réussis.
- L’API Catalogue est prête à être testée avec PostgreSQL et Docker.
- Les modifications sont mergées sur `main` via PR #8, tag `v1.0.0` poussé.

### Travail restant

> ✅ **Aucun — toutes les tâches Ouzziki sont terminées.**  
> Prochaine étape : v2.0.0 pour la démo de déploiement indépendant (catalogue v2 sans redémarrer panier/commandes).

## 🐳 Docker Hub — Stratégie par membre (Important)

> [!IMPORTANT]
> **Chaque membre utilise SON propre Docker Hub.** C’est la stratégie recommandée pour garder les pipelines indépendants et éviter de partager les credentials.

Le sujet exige : *“pipeline Jenkins indépendant pour chaque microservice, avec son propre cycle de versions, afin de permettre le déploiement d’un microservice sans redéployer les autres.”*

Pour respecter cela, **ne pas utiliser un seul compte commun** — chacun pousse sur son namespace :

| Membre | Service | Image Docker Hub | Jenkinsfile `DOCKERHUB_USER` |
|---|---|---|---|
| **Ouzziki Lhoussaine** | Catalogue | `ouzzikilhoussaine/catalogue:v1.0.0` | `ouzziki` |
| **Ouzziki Lhoussaine** | Frontend | `ouzzikilhoussaine/frontend:v1.0.0` | `ouzziki` |
| **Zineb Hajaj** | Panier | `zinebhajaj/panier:vX.X.X` | `zinebhajaj` |
| **Hasna ELhassani** | Commandes | `hasnaelhassani/commandes:vX.X.X` | `hasnaelhassani` |
| **Zakaria Aribi** | Infra | `zakiar3312/...` ou `k8s` manifests uniquement | — |

### Que faire dans ton Jenkinsfile ?

Remplace `CHANGE_ME` par ton username Docker Hub avant le premier build :

```groovy
// Jenkinsfile (Catalogue)
environment {
  DOCKERHUB_USER = 'ouzziki'  
  IMAGE = "${DOCKERHUB_USER}/catalogue"
  TAG = "v${BUILD_NUMBER}"
}
```

```groovy
// frontend/Jenkinsfile (Frontend)
environment {
  DOCKERHUB_USER = 'ouzziki'
  IMAGE = "${DOCKERHUB_USER}/frontend"
  TAG = "v${BUILD_NUMBER}"
}
```

### Credentials Jenkins

Chaque membre crée ses credentials `dockerhub-credentials` dans son Jenkins :
- Type : `Username with password`
- ID : `dockerhub-credentials`
- Username : ton Docker Hub username
- Password : ton Docker Hub Access Token (pas le mot de passe perso)

Le pipeline fait ensuite :
```bash
echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
docker push $IMAGE:$TAG
```

### Pour Zakaria (Infrastructure)

Zakaria récupère les noms d’images exacts pour `k8s/` :
```yaml
# k8s/catalogue/deployment.yaml
image: ouzzikilhoussaine/catalogue:v1.0.0

# k8s/frontend/deployment.yaml
image: ouzzikilhoussaine/frontend:v1.0.0

# k8s/ingress.yaml
/api/catalogue  → catalogue-service:3000
/api/panier     → panier-service:3001
/api/commandes  → commandes-service:3002
/               → frontend:80
```

> Alternative : si le groupe préfère 1 seul compte commun, créez `devopsgroupe2fpl` et partagez le token — mais gardez les 4 pipelines séparés (1 Jenkinsfile par repo).

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

Lancer les tests unitaires :

```bash
npm test -- --coverage
# → 10 PASS / 100% couverture
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

La colonne `created_at` de la base de données est convertie en `createdAt` par l’API. `id` est bien un nombre (fix `Number(row.id)` pour BIGINT).

## CI/CD — Pipelines indépendants

Chaque service a son propre `Jenkinsfile` (4 étapes : Build → Test → Push → Deploy) déclenché uniquement sur son dépôt :

- `catalogue-service/Jenkinsfile` → `ouzzikilhoussaine/catalogue:v${BUILD_NUMBER}`
- `frontend/Jenkinsfile` → `ouzzikilhoussaine/frontend:v${BUILD_NUMBER}`
- `panier-service/Jenkinsfile` → `zinebhajaj/panier:v${BUILD_NUMBER}`
- `commandes-service/Jenkinsfile` → `hasnaelhassani/commandes:v${BUILD_NUMBER}`

La démo `v2.0.0` consistera à pousser une nouvelle version du Catalogue uniquement et vérifier que les pods Panier/Commandes n’ont pas été recréés :

```bash
git tag v2.0.0 && git push origin v2.0.0
# Jenkins Catalogue se déclenche → kubectl set image catalogue → rollout
# Panier/Commandes restent inchangés
```

## Versioning

- `v1.0.0` → première version stable (actuelle)
- `v1.x.0` → nouvelles features mineures
- `v1.0.x` → bug fixes
- `v2.0.0` → breaking change / démo déploiement indépendant

Voir `CHANGELOG.md` pour l’historique.
