window.addEventListener('DOMContentLoaded', () => {
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const loggedUser = sessionStorage.getItem('docuCraft_logged_in_user');
  if (loggedUser) {
    const btn = document.getElementById('authNavBtn');
    btn.innerHTML = `<i class="fa-solid fa-user-check"></i>`;
    btn.setAttribute('onclick', 'handleLogout()');
    btn.style.background = '#64748b';
    btn.title = `Logged in as ${loggedUser} (Click to Logout)`;
  }
});
