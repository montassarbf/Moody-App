document.addEventListener('DOMContentLoaded', function() {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 800);
  }

  const victoryInput = document.getElementById('victory-input');
  const addBtn = document.getElementById('add-victory-btn');
  const victoryList = document.getElementById('victory-list');

  let victories = JSON.parse(localStorage.getItem('victories')) || [];

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const icons = { success: 'check-circle-fill', error: 'x-circle-fill', info: 'info-circle-fill' };
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <i class="bi bi-${icons[type] || 'info-circle-fill'} toast__icon"></i>
      <span class="toast__content">${message}</span>
      <button class="toast__close" onclick="this.parentElement.remove()">
        <i class="bi bi-x-lg"></i>
      </button>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  function animateNumber(element, target) {
    let current = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    
    function update() {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }
    
    update();
  }

  function triggerCelebration() {
    for (let i = 1; i <= 15; i++) {
      const confetti = document.createElement('div');
      confetti.className = `confetti confetti--${(i % 9) + 1}`;
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      
      const colors = ['var(--color-primary)', 'var(--color-success)', 'var(--color-accent)', 'var(--color-warning)', '#FFD700'];
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.width = `${5 + Math.random() * 10}px`;
      confetti.style.height = confetti.style.width;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }
    
    const btn = document.getElementById('add-victory-btn');
    if (btn) {
      btn.classList.add('bounce-success');
      setTimeout(() => btn.classList.remove('bounce-success'), 800);
    }
  }

  function renderVictories() {
    if (victories.length === 0) {
      victoryList.innerHTML = `
        <div class="empty-state fade-in">
          <div class="empty-state__icon">
            <i class="bi bi-trophy-fill"></i>
          </div>
          <h3 class="empty-state__title">Aucune victoire</h3>
          <p class="empty-state__text">Ajoutez votre première victoire ci-dessus !</p>
        </div>
      `;
      return;
    }

    victoryList.innerHTML = victories.map((victory, index) => `
      <div class="victory-item fade-in" data-index="${index}" style="animation-delay: ${index * 0.1}s;">
        <span class="victory-emoji">
          <i class="bi bi-crosshair"></i>
        </span>
        <span class="victory-text">${escapeHtml(victory)}</span>
        <button class="victory-delete" aria-label="Supprimer" onclick="deleteVictory(${index})">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `).join('');
  }

  function addVictory() {
    const text = victoryInput.value.trim();
    if (!text) {
      showToast('Veuillez entrer une victoire', 'error');
      victoryInput.classList.add('shake');
      setTimeout(() => victoryInput.classList.remove('shake'), 400);
      return;
    }

    victories.unshift(text);
    localStorage.setItem('victories', JSON.stringify(victories));
    victoryInput.value = '';
    renderVictories();
    
    triggerCelebration();
    showToast('Victoire ajoutée ! 🎉', 'success');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      currentUser.coins = (currentUser.coins || 0) + 5;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    victoryInput.focus();
  }

  window.deleteVictory = function(index) {
    victories.splice(index, 1);
    localStorage.setItem('victories', JSON.stringify(victories));
    renderVictories();
    showToast('Victoire supprimée', 'info');
  };

  addBtn.addEventListener('click', addVictory);
  
  victoryInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addVictory();
    }
  });

  victoryInput.addEventListener('focus', function() {
    this.parentElement.classList.add('focus');
  });

  victoryInput.addEventListener('blur', function() {
    this.parentElement.classList.remove('focus');
  });

  renderVictories();
});