document.addEventListener('DOMContentLoaded', () => {
  // 🛒 КОРЗИНА
  const cart = [];
  const cartPanel = document.getElementById('cart-panel');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartBtn = document.querySelector('.cart-btn');
  const cartClose = document.querySelector('.cart-close');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.querySelector('.cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');

  // 📦 МОДАЛЬНОЕ ОКНО НАПИТКА
  const itemModal = document.getElementById('item-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalComp = document.getElementById('modal-composition');
  const modalPrice = document.getElementById('modal-price');
  const modalAddBtn = document.getElementById('modal-add-btn');
  const modalClose = document.querySelector('.modal-close');
  let currentItem = null;

  // Открытие карточки
  document.getElementById('menu-grid').addEventListener('click', e => {
    const item = e.target.closest('.menu-item');
    if (!item) return;
    if (e.target.classList.contains('add-btn')) {
      addToCart(item.dataset.id);
      return;
    }
    openItemModal(item);
  });

  function openItemModal(el) {
    currentItem = {
      id: el.dataset.id,
      name: el.dataset.name,
      price: Number(el.dataset.price),
      composition: el.dataset.composition
    };
    modalTitle.textContent = currentItem.name;
    modalComp.textContent = `Состав: ${currentItem.composition}`;
    modalPrice.textContent = `${currentItem.price} ₽`;
    itemModal.classList.add('active');
  }

  function closeItemModal() { itemModal.classList.remove('active'); currentItem = null; }
  modalClose.onclick = closeItemModal;
  itemModal.onclick = e => { if(e.target === itemModal) closeItemModal(); };
  modalAddBtn.onclick = () => { addToCart(currentItem.id); closeItemModal(); };

  // Логика корзины
  function addToCart(id) {
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...getMenuData(id), qty: 1 });
    renderCart();
  }

  function getMenuData(id) {
    const el = document.querySelector(`.menu-item[data-id="${id}"]`);
    return {
      id: el.dataset.id, name: el.dataset.name,
      price: Number(el.dataset.price), composition: el.dataset.composition
    };
  }

  function renderCart() {
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
      cartTotalEl.textContent = '0 ₽'; cartCountEl.textContent = '0'; return;
    }
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">${item.price} ₽ × ${item.qty}</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn minus" data-id="${item.id}">−</button>
          <button class="qty-btn plus" data-id="${item.id}">+</button>
          <button class="remove-btn" data-id="${item.id}">✕</button>
        </div>`;
      cartItemsEl.appendChild(div);
    });
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    cartTotalEl.textContent = `${total} ₽`;
    cartCountEl.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  }

  cartItemsEl.addEventListener('click', e => {
    const btn = e.target.closest('.qty-btn, .remove-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    const item = cart.find(i => i.id === id);
    if (btn.classList.contains('plus')) item.qty++;
    else if (btn.classList.contains('minus')) item.qty > 1 ? item.qty-- : (cart.splice(cart.indexOf(item), 1));
    else if (btn.classList.contains('remove-btn')) cart.splice(cart.indexOf(item), 1);
    renderCart();
  });

  cartBtn.onclick = () => cartPanel.classList.add('active');
  cartClose.onclick = cartOverlay.onclick = () => cartPanel.classList.remove('active');
  checkoutBtn.onclick = () => { alert('Спасибо за заказ! Мы свяжемся с вами.'); cart.length = 0; renderCart(); cartPanel.classList.remove('active'); };

  // 🖱️ Плавный скролл & Анимации
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if(t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);} });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section').forEach(s => observer.observe(s));
});