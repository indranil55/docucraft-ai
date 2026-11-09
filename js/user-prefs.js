// js/user-prefs.js

const STORAGE_KEYS = {
  HISTORY: 'docucraft_recent_history',
  BOOKMARKS: 'docucraft_bookmarked_tools',
  SETTINGS: 'docucraft_user_settings'
};

// --- 1. Recent Activity / History ---
export function addRecentActivity(toolName, fileName, status = 'Completed') {
  const history = getRecentHistory();
  const newEntry = {
    id: Date.now(),
    tool: toolName,
    file: fileName,
    status: status,
    timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Keep up to 20 recent records
  const updated = [newEntry, ...history.filter(item => item.file !== fileName)].slice(0, 20);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  renderHistoryUI();
}

export function getRecentHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
  } catch (e) {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  renderHistoryUI();
}

// --- 2. Tool Favorites / Bookmarks ---
export function toggleBookmark(toolId) {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(toolId);

  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(toolId);
  }

  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  updateBookmarkIcons();
  reorderToolsByBookmarks();
}

export function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) || [];
  } catch (e) {
    return [];
  }
}

// --- 3. Custom Settings ---
export function saveSetting(key, value) {
  const settings = getSettings();
  settings[key] = value;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || {
      imageQuality: 0.8,
      pageSize: 'A4',
      theme: 'dark'
    };
  } catch (e) {
    return { imageQuality: 0.8, pageSize: 'A4', theme: 'dark' };
  }
}

// --- UI Helpers ---
export function renderHistoryUI() {
  const container = document.getElementById('recent-history-list');
  if (!container) return;

  const history = getRecentHistory();
  if (history.length === 0) {
    container.innerHTML = '<li class="empty-log">No recent activity found.</li>';
    return;
  }

  container.innerHTML = history.map(item => `
    <li class="history-item">
      <div>
        <strong>${item.tool}</strong>: <span class="file-name">${item.file}</span>
      </div>
      <div class="history-meta">
        <span class="badge ${item.status.toLowerCase()}">${item.status}</span>
        <small>${item.timestamp}</small>
      </div>
    </li>
  `).join('');
}

export function updateBookmarkIcons() {
  const bookmarks = getBookmarks();
  document.querySelectorAll('[data-tool-id]').forEach(card => {
    const toolId = card.getAttribute('data-tool-id');
    const btn = card.querySelector('.bookmark-toggle');
    if (btn) {
      const isBookmarked = bookmarks.includes(toolId);
      btn.textContent = isBookmarked ? '★' : '☆';
      btn.classList.toggle('active', isBookmarked);
    }
  });
}

export function reorderToolsByBookmarks() {
  const bookmarks = getBookmarks();
  const grid = document.querySelector('.tools-grid');
  if (!grid || bookmarks.length === 0) return;

  const cards = Array.from(grid.children);
  cards.sort((a, b) => {
    const aId = a.getAttribute('data-tool-id');
    const bId = b.getAttribute('data-tool-id');
    const aFav = bookmarks.includes(aId) ? 1 : 0;
    const bFav = bookmarks.includes(bId) ? 1 : 0;
    return bFav - aFav;
  });

  cards.forEach(card => grid.appendChild(card));
}

// Automatically initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderHistoryUI();
  updateBookmarkIcons();
  reorderToolsByBookmarks();
});
