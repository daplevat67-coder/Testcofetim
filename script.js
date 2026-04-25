document.addEventListener('DOMContentLoaded', () => {
  const cart = [];
  const cartPanel = document.getElementById('cart-panel');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartBtn = document.querySelector('.cart-btn');
  const cartClose = document.querySelector('.cart-close');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.querySelector('.cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');

  const itemModal = document.getElementById('item-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalComp = document.getElementById('modal-composition');
  const modalPrice = document.getElementById('modal-price');
  const modalAddBtn = document.getElementById('modal-add-btn');
  const modalClose = document.querySelector('.modal-close');
  let currentItem = null;

  // Логика кликов по карточкам
  document.getElementById('menu-grid').addEventListener('click', e => {
    const item = e.target.closest('.menu-item');
    if (!item) return;

    // Если нажали на "+" — только добавляем и запускаем анимацию
    if (e.target.classList.contains('add-btn')) {
      e.stopPropagation();
      addToCart(item.dataset.id);
      launchPlane(e.target);
      return;
    }
    // Иначе открываем модалку
    openItemModal(item);
  });

  function openItemModal(el) {
    currentItem = { id: el.dataset.id, name: el.dataset.name, price: Number(el.dataset.price), composition: el.dataset.composition };
    modalTitle.textContent = currentItem.name;
    modalComp.textContent = `Состав: ${currentItem.composition}`;
    modalPrice.textContent = `${currentItem.price} ₽`;
    itemModal.classList.add('active');
  }
  function closeItemModal() { itemModal.classList.remove('active'); currentItem = null; }
  modalClose.onclick = closeItemModal;
  itemModal.onclick = e => { if(e.target === itemModal) closeItemModal(); };
  modalAddBtn.onclick = () => { addToCart(currentItem.id); closeItemModal(); };

  // Корзина
  function addToCart(id) {
    const existing = cart.find(i => i.id === id);    if (existing) existing.qty++;
    else cart.push({ id, name: getMenuData(id).name, price: getMenuData(id).price, qty: 1 });
    renderCart();
    cartBtn.classList.add('pulse');
    setTimeout(() => cartBtn.classList.remove('pulse'), 400);
  }

  function getMenuData(id) {
    const el = document.querySelector(`.menu-item[data-id="${id}"]`);
    return { id: el.dataset.id, name: el.dataset.name, price: Number(el.dataset.price) };
  }

  function renderCart() {
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) { cartItemsEl.innerHTML = '<p class="cart-empty">Корзина пуста</p>'; cartTotalEl.textContent = '0 ₽'; cartCountEl.textContent = '0'; return; }
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `<div class="cart-item-info"><span class="cart-item-name">${item.name}</span><span class="cart-item-price">${item.price} ₽ × ${item.qty}</span></div>
        <div class="cart-item-controls"><button class="qty-btn minus" data-id="${item.id}">−</button><button class="qty-btn plus" data-id="${item.id}">+</button><button class="remove-btn" data-id="${item.id}">✕</button></div>`;
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
    else if (btn.classList.contains('minus')) item.qty > 1 ? item.qty-- : cart.splice(cart.indexOf(item), 1);
    else if (btn.classList.contains('remove-btn')) cart.splice(cart.indexOf(item), 1);
    renderCart();
  });

  cartBtn.onclick = () => cartPanel.classList.add('active');
  cartClose.onclick = cartOverlay.onclick = () => cartPanel.classList.remove('active');
  checkoutBtn.onclick = () => { alert('Спасибо за заказ! Мы свяжемся с вами.'); cart.length = 0; renderCart(); cartPanel.classList.remove('active'); };

  // ✈️ Анимация самолётика (ЗАМЕДЛЕНА + БЕЗ БОМБАРДИРОВКИ)
  function launchPlane(btn) {
    const existingPlane = document.querySelector('.flying-plane');
    if (existingPlane) existingPlane.remove();

    const plane = document.createElement('div');
    plane.className = 'flying-plane';
    plane.innerHTML = '✈️';    
    const btnRect = btn.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();
    
    const item = btn.closest('.menu-item');
    plane.style.color = item.dataset.color || '#d4a373';

    plane.style.left = `${btnRect.left + btnRect.width / 2}px`;
    plane.style.top = `${btnRect.top + btnRect.height / 2}px`;
    document.body.appendChild(plane);

    const tx = cartRect.left + cartRect.width / 2 - (btnRect.left + btnRect.width / 2);
    const ty = cartRect.top + cartRect.height / 2 - (btnRect.top + btnRect.height / 2);
    plane.style.setProperty('--tx', `${tx}px`);
    plane.style.setProperty('--ty', `${ty}px`);

    requestAnimationFrame(() => plane.classList.add('fly'));
    setTimeout(() => plane.remove(), 1500);
  }

  // Плавный скролл & Анимации появления
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if(t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        e.target.classList.add('visible');
        if(e.target.id === 'menu') {
          document.querySelectorAll('.menu-item').forEach((item, i) => {
            item.style.opacity = '0'; item.style.transform = 'translateY(15px)';
            setTimeout(() => { item.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, i * 80);
          });
        }
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section').forEach(s => observer.observe(s));
});