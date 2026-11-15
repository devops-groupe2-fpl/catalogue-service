const USER_ID = 'user1';

const money = (value) => `${Number(value || 0).toFixed(2).replace('.', ',')} €`;

function setMessage(id, text, type = '') {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = text;
  element.className = `message ${type}`;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Erreur HTTP ${response.status}`);
  return body;
}

async function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  try {
    const cart = await requestJson(`/api/panier/cart/${USER_ID}`);
    badge.textContent = (cart.items || []).reduce((total, item) => total + item.quantity, 0);
  } catch (_) {
    badge.textContent = '0';
  }
}

async function loadProducts() {
  const list = document.getElementById('products-list');
  if (!list) return;
  try {
    const products = await requestJson('/api/catalogue/products');
    if (products.length === 0) {
      list.innerHTML = '<p class="empty-state">Aucun produit disponible pour le moment.</p>';
      return;
    }
    list.innerHTML = products.map((product) => `
      <article class="product-card">
        <h2>${escapeHtml(product.name)}</h2>
        <p>${escapeHtml(product.description || 'Aucune description disponible.')}</p>
        <div class="price">${money(product.price)}</div>
        <p class="stock">${product.stock} en stock</p>
        <button class="button primary add-to-cart" data-product-id="${product.id}" type="button">
          Ajouter au panier
        </button>
      </article>
    `).join('');
    list.querySelectorAll('.add-to-cart').forEach((button) => {
      button.addEventListener('click', () => addToCart(button.dataset.productId, button));
    });
  } catch (error) {
    setMessage('catalogue-message', `Impossible de charger le catalogue : ${error.message}`, 'error');
  }
}

async function addToCart(productId, button) {
  button.disabled = true;
  try {
    await requestJson(`/api/panier/cart/${USER_ID}/add`, {
      method: 'POST',
      body: JSON.stringify({ productId: Number(productId), quantity: 1 }),
    });
    setMessage('catalogue-message', 'Produit ajouté au panier.', 'success');
    await updateCartCount();
  } catch (error) {
    setMessage('catalogue-message', `Impossible d’ajouter le produit : ${error.message}`, 'error');
  } finally {
    button.disabled = false;
  }
}

async function loadCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  try {
    const cart = await requestJson(`/api/panier/cart/${USER_ID}`);
    document.getElementById('cart-total').textContent = money(cart.totalAmount);
    if (!cart.items || cart.items.length === 0) {
      container.innerHTML = '<p class="empty-state">Votre panier est vide.</p>';
      document.getElementById('checkout-button').disabled = true;
      return;
    }
    container.innerHTML = cart.items.map((item) => `
      <article class="cart-item">
        <div>
          <h2>${escapeHtml(item.name || `Produit #${item.productId}`)}</h2>
          <p>${item.quantity} × ${money(item.unitPrice)}</p>
        </div>
        <button class="button danger remove-item" data-product-id="${item.productId}" type="button">Retirer</button>
      </article>
    `).join('');
    container.querySelectorAll('.remove-item').forEach((button) => {
      button.addEventListener('click', () => removeFromCart(button.dataset.productId));
    });
  } catch (error) {
    setMessage('cart-message', `Impossible de charger le panier : ${error.message}`, 'error');
  }
}

async function removeFromCart(productId) {
  try {
    await requestJson(`/api/panier/cart/${USER_ID}/remove/${productId}`, { method: 'DELETE' });
    await loadCart();
    await updateCartCount();
  } catch (error) {
    setMessage('cart-message', `Impossible de retirer le produit : ${error.message}`, 'error');
  }
}

async function checkout() {
  const button = document.getElementById('checkout-button');
  button.disabled = true;
  try {
    await requestJson(`/api/panier/cart/${USER_ID}/checkout`, { method: 'POST' });
    setMessage('cart-message', 'Commande créée avec succès.', 'success');
    await loadCart();
    await updateCartCount();
  } catch (error) {
    setMessage('cart-message', `Commande indisponible : ${error.message}`, 'error');
    button.disabled = false;
  }
}

async function loadHistory() {
  const list = document.getElementById('orders-list');
  if (!list) return;
  try {
    const orders = await requestJson(`/api/commandes/orders/${USER_ID}`);
    if (!orders.length) {
      list.innerHTML = '<p class="empty-state">Aucune commande passée pour le moment.</p>';
      return;
    }
    list.innerHTML = orders.map((order) => `
      <article class="order-card">
        <div class="order-header">
          <h2>Commande #${escapeHtml(order.orderId)}</h2>
          <span class="status">${escapeHtml(order.status)}</span>
        </div>
        <p class="order-date">${formatDate(order.createdAt)}</p>
        <p class="order-items">${(order.items || []).length} article(s) · Total : ${money(order.totalAmount)}</p>
      </article>
    `).join('');
  } catch (error) {
    setMessage('history-message', `Impossible de charger l’historique : ${error.message}`, 'error');
  }
}

function formatDate(value) {
  if (!value) return 'Date inconnue';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadProducts();
  loadCart();
  loadHistory();
  document.getElementById('checkout-button')?.addEventListener('click', checkout);
});
