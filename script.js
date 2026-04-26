// 📦 Данные меню
const menuItems = [
    { id: 1, name: 'Эспрессо', description: 'Классический крепкий кофе', price: 150 },
    { id: 2, name: 'Капучино', description: 'Нежная молочная пенка', price: 220 },
    { id: 3, name: 'Латте', description: 'Мягкий сливочный вкус', price: 240 },
    { id: 4, name: 'Американо', description: 'Лёгкий и ароматный', price: 180 },
    { id: 5, name: 'Кофе в зёрнах (1 кг)', description: 'Свежая обжарка', price: 1200 }
];

let cart = [];

// 🌍 Привязка функций к window (чтобы работали из HTML onclick)
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.toggleMenu = toggleMenu;

// 🚀 Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    loadCart(); // Загружаем сохранённую корзину при старте
});

// 💾 Загрузка корзины (сохраняется после перезагрузки)
function loadCart() {
    try {
        const saved = localStorage.getItem('coffeeCart');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) cart = parsed;
        }
    } catch (e) {
        console.warn('Ошибка загрузки корзины:', e);
        cart = [];
    }
    updateCartCount();
}

// 💾 Сохранение корзины
function saveCart() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
}

// 🔢 Обновление цифры над корзиной
function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (!countEl) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
    
    // Показываем бейдж только если есть товары
    countEl.style.display = totalItems > 0 ? 'flex' : 'none';
}

// ➕ Добавить в корзину
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showNotification(`${item.name} добавлен в корзину`);
}

// ➖➕ Изменить количество
function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        saveCart();
        updateCartCount();
        renderCart(); // Обновляем модальное окно, если оно открыто
    }
}

// 🗑️ Удалить из корзины
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartCount();
    renderCart();
}

// 🛒 Отрисовка содержимого корзины
function renderCart() {
    const itemsEl = document.getElementById('cartItems');    const totalEl = document.getElementById('cartTotal');
    if (!itemsEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="cart-empty">Корзина пуста ☕</p>';
        if (totalEl) totalEl.textContent = '0 ₽';
        return;
    }

    let total = 0;
    itemsEl.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} ₽ × ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
                </div>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.textContent = `${total} ₽`;
}

// 🔄 Открыть/закрыть корзину
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        renderCart();
    }
}

// 📤 Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста! ☕');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderList = cart.map(i => `• ${i.name} × ${i.quantity}`).join('\n');
    
    alert(`✅ Заказ оформлен!\n\n${orderList}\n\n💰 Итого: ${total} ₽\n\n(В реальном проекте данные уйдут в Telegram или на почту)`);    
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    toggleCart();
    showNotification('Спасибо за заказ! Ждём вас ☕');
}

// 🔔 Уведомления
function showNotification(message) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed; top: 90px; right: 20px; background: #4B3621; color: #fff;
        padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999; animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2500);
}

// 📱 Мобильное меню
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

// 🌊 Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// 🎨 Анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
`;
document.head.appendChild(style);