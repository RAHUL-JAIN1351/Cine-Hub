// common.js — shared helpers
const apiBase = 'https://691616dd465a9144626ed82e.mockapi.io/api'; // updated MockAPI base

/* ===============================
   API Helpers
=============================== */
async function apiGet(path) {
  try {
    const res = await fetch(`${apiBase}${path}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (e) {
    console.error('apiGet', path, e);
    return [];
  }
}

async function apiPost(path, body) {
  try {
    const res = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok ? await res.json() : null;
  } catch (e) {
    console.error('apiPost', path, e);
    return null;
  }
}

async function apiDelete(path) {
  try {
    const res = await fetch(`${apiBase}${path}`, { method: 'DELETE' });
    return res.ok ? await res.json() : null;
  } catch (e) {
    console.error('apiDelete', path, e);
    return null;
  }
}

/* ===============================
   Toast Notification
=============================== */
let toastTimer = null;
function showToast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.classList.add('hidden'), 300);
  }, 2500);
}

/* ===============================
   Counts (for favourites)
=============================== */
async function updateCounts() {
  const fav = document.getElementById('fav-count');
  try {
    const favs = await apiGet('/favourites');
    if (fav) fav.textContent = favs.length;
  } catch (e) {
    console.warn('count update failed');
  }
}

/* ===============================
   Create Movie Card
=============================== */
function createMovieCard(movie, opts = {}) {
  const { showFavourite = true, showRemove = false } = opts;
  const card = document.createElement('article');
  card.className = 'movie-card';
  card.setAttribute('data-id', movie.id);

  card.innerHTML = `
    <div class="movie-poster">
      <img loading="lazy" src="${escapeHtml(movie.poster || '')}" alt="${escapeHtml(movie.title || 'Movie poster')}" />
    </div>
    <div class="movie-info">
      <div class="movie-title">${escapeHtml(movie.title || 'Untitled')}</div>
      <div class="movie-meta">
        <span>${escapeHtml(movie.category || '—')}</span> |
        <span>⭐ ${escapeHtml(String(movie.rating ?? '—'))}</span> |
        <span>${escapeHtml(String(movie.year ?? '—'))}</span>
      </div>
    </div>
    <div class="movie-buttons">
      ${showFavourite ? `<button class="btn btn-fav" data-action="fav">❤️</button>` : ''}
      ${showRemove ? `<button class="btn btn-danger" data-action="remove">Remove</button>` : ''}
    </div>
  `;

  card.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');

    if (action === 'fav') {
      const res = await apiPost('/favourites', movie);
      showToast(res ? 'Added to favourites ❤️' : 'Already in favourites');
      updateCounts();
    } else if (action === 'remove') {
      await apiDelete(`/favourites/${movie.id}`);
      showToast('Removed from favourites 💔');
      if (typeof window.removeHandler === 'function') window.removeHandler(movie.id);
      updateCounts();
    }
  });

  observerObserve(card);
  return card;
}

/* ===============================
   Utilities
=============================== */
function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  }[m]));
}

const _observer = new IntersectionObserver(entries => {
  entries.forEach(ent => {
    if (ent.isIntersecting) {
      ent.target.classList.add('visible');
      _observer.unobserve(ent.target);
    }
  });
}, { threshold: 0.12 });

function observerObserve(el) {
  try { _observer.observe(el); } catch (e) {}
}

function debounce(fn, ms = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

/* Expose for debugging */
window.apiGet = apiGet;
window.apiPost = apiPost;
window.apiDelete = apiDelete;
window.showToast = showToast;
window.createMovieCard = createMovieCard;
window.updateCounts = updateCounts;
