// ✈️ Анимация самолётика (ЗАМЕДЛЕНА + БЕЗ БОМБАРДИРОВКИ)
  function launchPlane(btn) {
    // Если самолётик уже летит — удаляем его, чтобы не было наложения
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