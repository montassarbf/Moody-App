document.addEventListener('DOMContentLoaded', function() {
  initLoader();
  initUserDisplay();
  initUserMenu();
  initThemeToggle();
  initPositiveMessage();
  initActivityGraph();
  initEmojiSelection();
  initPostForm();
  initPostsDisplay();
  initKeyboardShortcuts();
  initScrollAnimations();
});

function initLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  }
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

function initUserDisplay() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userElement = document.getElementById('currentUser');
  const avatarElement = document.getElementById('userAvatar');
  const menuAvatar = document.getElementById('menuAvatar');
  const menuUsername = document.getElementById('menuUsername');
  const scoreElement = document.getElementById('userScore');
  const helpedElement = document.getElementById('helpedCount');
  const victoryElement = document.getElementById('victoryCount');
  
  const avatarIcons = {
    '😊': 'bi-emoji-smile',
    '😎': 'bi-emoji-sunglasses',
    '🌟': 'bi-star-fill',
    '💪': 'bi-lightning-charge-fill',
    '🎉': 'bi-balloon-fill',
    '🤗': 'bi-heart-fill'
  };
  
  function updateAvatar(element, emoji) {
    const iconName = avatarIcons[emoji] || 'bi-person-fill';
    if (element) {
      element.innerHTML = `<i class="bi ${iconName}"></i>`;
    }
  }
  
  if (currentUser && currentUser.name) {
    if (userElement) userElement.textContent = currentUser.name;
    if (avatarElement) updateAvatar(avatarElement, currentUser.avatar);
    if (menuAvatar) updateAvatar(menuAvatar, currentUser.avatar);
    if (menuUsername) menuUsername.textContent = currentUser.name;
    if (scoreElement) animateNumber(scoreElement, currentUser.coins || 0);
    if (helpedElement) animateNumber(helpedElement, currentUser.helped || 0);
  } else {
    if (userElement) userElement.textContent = 'Visiteur';
    if (avatarElement) updateAvatar(avatarElement, '😊');
    if (menuAvatar) updateAvatar(menuAvatar, '😊');
    if (menuUsername) menuUsername.textContent = 'Visiteur';
    if (scoreElement) scoreElement.textContent = '0';
    if (helpedElement) helpedElement.textContent = '0';
  }
  
  if (victoryElement) {
    const victories = JSON.parse(localStorage.getItem('victories')) || [];
    animateNumber(victoryElement, victories.length);
  }
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

function initUserMenu() {
  const trigger = document.getElementById('userMenuBtn');
  const dropdown = document.getElementById('userDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (!trigger || !dropdown) return;
  
  trigger.addEventListener('click', function(e) {
    e.stopPropagation();
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    dropdown.classList.toggle('show');
  });
  
  document.addEventListener('click', function(e) {
    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
      trigger.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('show');
    }
  });
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      showToast('Déconnexion réussie !', 'success');
      setTimeout(() => window.location.href = 'login.html', 1000);
    });
  }
}

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    toggle.innerHTML = '<i class="bi bi-sun-fill theme-icon"></i>';
  }
  
  toggle.addEventListener('click', function() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      this.innerHTML = '<i class="bi bi-moon-fill theme-icon"></i>';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      this.innerHTML = '<i class="bi bi-sun-fill theme-icon"></i>';
    }
  });
}

function initPositiveMessage() {
  const messages = [
    'Vous êtes incroyable aujourd\'hui !',
    'Continuez à briller !',
    'Votre énergie est contagieuse !',
    'Aujourd\'hui est votre jour !',
    'Gardez le sourire, tout est possible !',
    'Chaque petit pas compte !',
    'Vous êtes plus fort que vous ne le pensez !',
    'Un jour à la fois, vous y arriverez !',
    'Votre présence compte pour les autres !',
    'Ensemble, on va plus loin !',
    'La meilleur façon de prédire le futur, c\'est de le créer !',
    'Vous êtes capable de grandes choses !'
  ];
  
  const messageElement = document.getElementById('positiveMessage');
  if (!messageElement) return;
  
  function updateMessage() {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    messageElement.style.opacity = 0;
    messageElement.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      messageElement.textContent = '"' + randomMsg + '"';
      messageElement.style.opacity = 1;
      messageElement.style.transform = 'translateY(0)';
    }, 300);
  }
  
  messageElement.style.transition = 'all 0.3s ease';
  updateMessage();
  setInterval(updateMessage, 6000);
}

function initActivityGraph() {
  const ctx = document.getElementById('activityGraph')?.getContext('2d');
  if (!ctx) return;
  
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const textColor = isDark ? '#94A3B8' : '#64748B';
  
  const data = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [{
      label: 'Étudiants aidés',
      data: [3, 5, 7, 4, 6, 8, 10],
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, isDark ? 'rgba(106, 143, 197, 0.1)' : 'rgba(74, 111, 165, 0.1)');
        gradient.addColorStop(1, isDark ? 'rgba(106, 143, 197, 0.4)' : 'rgba(74, 111, 165, 0.4)');
        return gradient;
      },
      borderColor: isDark ? '#6a8fc5' : '#4A6FA5',
      borderWidth: 3,
      fill: true,
      tension: 0.5,
      pointBackgroundColor: isDark ? '#6a8fc5' : '#4A6FA5',
      pointBorderColor: '#fff',
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 10,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: isDark ? '#6a8fc5' : '#4A6FA5',
      pointHoverBorderWidth: 3
    }]
  };

  const statsData = {
    total: 43,
    average: 6.1,
    max: 10
  };
  
  new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1E293B' : '#fff',
          titleColor: isDark ? '#F1F5F9' : '#1E293B',
          bodyColor: isDark ? '#94A3B8' : '#64748B',
          borderColor: isDark ? '#334155' : '#E2E8F0',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          displayColors: false,
          titleFont: { size: 14, weight: '600' },
          bodyFont: { size: 13 },
          callbacks: {
            title: (items) => items[0].label,
            label: (item) => `${item.raw} étudiants aidés`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: { 
            color: textColor,
            font: { size: 12 },
            stepSize: 2
          },
          border: { display: false }
        },
        x: {
          grid: { display: false },
          ticks: { 
            color: textColor,
            font: { size: 12, weight: '500' }
          },
          border: { display: false }
        }
      }
    }
  });
  
  const chartStats = document.querySelector('.chart-stats');
  if (chartStats) {
    animateNumber(chartStats.querySelector('.chart-stat:nth-child(1) .chart-stat__value'), statsData.total);
    animateNumber(chartStats.querySelector('.chart-stat:nth-child(2) .chart-stat__value'), statsData.average);
    animateNumber(chartStats.querySelector('.chart-stat:nth-child(3) .chart-stat__value'), statsData.max);
  }
}

function initEmojiSelection() {
  const emojis = document.querySelectorAll('.emoji-btn');
  const selectedDisplay = document.getElementById('selectedEmoji');
  
  emojis.forEach(emoji => {
    emoji.addEventListener('click', function() {
      const selected = this.dataset.emoji;
      
      emojis.forEach(e => e.classList.remove('active'));
      this.classList.add('active');
      
      this.style.animation = 'none';
      this.offsetHeight;
      this.style.animation = 'bounce 0.5s ease';
      
      if (selectedDisplay) {
        selectedDisplay.textContent = selected;
        selectedDisplay.style.fontSize = '2rem';
        selectedDisplay.style.display = 'inline-block';
        selectedDisplay.style.animation = 'bounce 0.5s ease';
      }
      
      const hiddenInput = document.getElementById('emoji');
      if (hiddenInput) hiddenInput.value = selected;
      
      saveMood(selected);
    });
  });
}

function saveMood(emoji) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    currentUser.currentMood = emoji;
    currentUser.moodTimestamp = new Date().toISOString();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
}

function initPostForm() {
  const form = document.getElementById('problemForm');
  if (!form) return;
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const emoji = document.getElementById('emoji')?.value || '😐';
    const imageInput = document.getElementById('image');
    
    if (!title || !content) {
      showToast('Veuillez remplir tous les champs', 'error');
      shakeElement(form);
      return;
    }
    
    const post = {
      title,
      content,
      emoji,
      image: imageInput?.files[0] ? URL.createObjectURL(imageInput.files[0]) : null,
      comments: [],
      likes: 0,
      reactions: {},
      date: new Date().toISOString()
    };
    
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    showToast('Votre problème a été partagé avec succès !', 'success');
    
    setTimeout(() => window.location.href = 'view.html', 1500);
  });
}

function shakeElement(el) {
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 400);
}

function initPostsDisplay() {
  const postsContainer = document.getElementById('posts');
  if (!postsContainer) return;
  
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  
  function renderPosts() {
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
      postsContainer.innerHTML = `
        <div class="empty-state fade-in">
          <div class="empty-state__icon">📭</div>
          <h3 class="empty-state__title">Aucun problème partagé</h3>
          <p class="empty-state__text">Soyez le premier à partager votre histoire</p>
          <a href="create.html" class="btn" style="margin-top: 1rem;">Créer un post</a>
        </div>
      `;
      return;
    }
    
    posts.forEach((post, index) => {
      const postEl = document.createElement('article');
      postEl.className = 'post fade-in';
      postEl.style.animationDelay = `${index * 0.1}s`;
      postEl.setAttribute('data-animate', '');
      
      const timeAgo = formatTimeAgo(post.date);
      
      postEl.innerHTML = `
        <header class="post__header">
          <h3 class="post__title">${escapeHtml(post.title)}</h3>
          <span class="post__emoji">${post.emoji || '😐'}</span>
        </header>
        <p class="post__content">${escapeHtml(post.content)}</p>
        ${post.image ? `<img src="${post.image}" alt="Image du post" class="post__image">` : ''}
        <div class="post__meta">
          <span>📅 ${timeAgo}</span>
          <span style="margin-left: 1rem;">💬 ${post.comments?.length || 0}</span>
        </div>
        
        <div class="reaction-bar">
          <button class="reaction-btn" data-index="${index}" data-emoji="❤️" title="Amour">❤️</button>
          <button class="reaction-btn" data-index="${index}" data-emoji="👍" title="J'aime">👍</button>
          <button class="reaction-btn" data-index="${index}" data-emoji="😂" title="Drôle">😂</button>
          <button class="reaction-btn" data-index="${index}" data-emoji="😮" title="Surprise">😮</button>
          <button class="reaction-btn" data-index="${index}" data-emoji="😢" title="Triste">😢</button>
        </div>
        <p class="emoji-display" style="font-size: 0.875rem; text-align: left;">
          ${formatReactions(post.reactions)}
        </p>
        
        <div class="comment-section">
          <div class="comment-input-group">
            <input type="text" id="comment-input-${index}" class="form-control" placeholder="Écrire un commentaire...">
            <button class="btn btn--sm" onclick="addComment(${index})">Envoyer</button>
          </div>
          <div id="comments-${index}" class="comment-list">
            ${renderComments(post.comments)}
          </div>
        </div>
      `;
      postsContainer.appendChild(postEl);
      
      initScrollAnimations();
    });
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const postIndex = parseInt(this.dataset.index);
        const emoji = this.dataset.emoji;
        
        this.style.animation = 'bounce 0.3s ease';
        setTimeout(() => this.style.animation = '', 300);
        
        addReaction(postIndex, emoji);
      });
    });
  }
  
  window.addReaction = function(postIndex, emoji) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    if (!posts[postIndex]) return;
    
    posts[postIndex].reactions = posts[postIndex].reactions || {};
    posts[postIndex].reactions[emoji] = (posts[postIndex].reactions[emoji] || 0) + 1;
    
    localStorage.setItem('posts', JSON.stringify(posts));
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      currentUser.coins = (currentUser.coins || 0) + 1;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateStats();
    }
    
    showToast('Réaction ajoutée ! +1 point', 'success');
    renderPosts();
  };
  
  window.addComment = function(postIndex) {
    const input = document.getElementById(`comment-input-${postIndex}`);
    const text = input?.value.trim();
    if (!text) return;
    
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    if (!posts[postIndex]) return;
    
    posts[postIndex].comments = posts[postIndex].comments || [];
    posts[postIndex].comments.push(text);
    
    localStorage.setItem('posts', JSON.stringify(posts));
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      currentUser.coins = (currentUser.coins || 0) + 1;
      currentUser.helped = (currentUser.helped || 0) + 1;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateStats();
    }
    
    showToast('Commentaire ajouté ! +1 point', 'success');
    renderPosts();
  };
  
  window.deletePost = function(postIndex) {
    showConfirmModal('Voulez-vous vraiment supprimer ce post ?', () => {
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.splice(postIndex, 1);
      localStorage.setItem('posts', JSON.stringify(posts));
      showToast('Post supprimé', 'info');
      renderPosts();
    });
  };
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    return `Il y a ${Math.floor(seconds / 86400)} jours`;
  }
  
  function formatReactions(reactions) {
    if (!reactions || Object.keys(reactions).length === 0) {
      return '<span style="color: var(--color-text-muted);">Pas encore de réactions</span>';
    }
    return Object.entries(reactions).map(([emoji, count]) => 
      `<span style="margin-right: 0.5rem;">${emoji} <span style="font-size: 0.75rem; color: var(--color-text-muted);">${count}</span></span>`
    ).join('');
  }
  
  function renderComments(comments) {
    if (!comments || comments.length === 0) {
      return '<p style="color: var(--color-text-muted); font-size: 0.875rem; padding: 0.5rem;">Aucun commentaire</p>';
    }
    return comments.map(c => `<div class="comment">${escapeHtml(c)}</div>`).join('');
  }
  
  renderPosts();
}

function updateStats() {
  const scoreEl = document.getElementById('userScore');
  const helpedEl = document.getElementById('helpedCount');
  const victoryEl = document.getElementById('victoryCount');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (currentUser) {
    if (scoreEl) animateNumber(scoreEl, currentUser.coins || 0);
    if (helpedEl) animateNumber(helpedEl, currentUser.helped || 0);
  }
  if (victoryEl) {
    const victories = JSON.parse(localStorage.getItem('victories')) || [];
    animateNumber(victoryEl, victories.length);
  }
}

function initKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'n' || e.key === 'N') {
      window.location.href = 'create.html';
    } else if (e.key === 'v' || e.key === 'V') {
      window.location.href = 'view.html';
    } else if (e.key === 'Escape') {
      const dropdown = document.getElementById('userDropdown');
      const trigger = document.getElementById('userMenuBtn');
      if (dropdown) dropdown.classList.remove('show');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

function showConfirmModal(message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal scale-in">
      <div class="modal__header">
        <h3 class="modal__title">⚠️ Confirmation</h3>
      </div>
      <div class="modal__body">
        <p>${message}</p>
      </div>
      <div class="modal__actions">
        <button class="btn btn--secondary" id="modalCancel">Annuler</button>
        <button class="btn" id="modalConfirm">Confirmer</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
  
  document.getElementById('modalCancel').addEventListener('click', () => closeModal());
  document.getElementById('modalConfirm').addEventListener('click', () => {
    onConfirm();
    closeModal();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  
  function closeModal() {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
  }
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

document.getElementById('login-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (username && password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.name === username && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      showToast('Connexion réussie !', 'success');
      setTimeout(() => window.location.href = 'index.html', 1000);
    } else {
      showToast('Nom ou mot de passe incorrect', 'error');
      this.classList.add('shake');
      setTimeout(() => this.classList.remove('shake'), 400);
    }
  }
});