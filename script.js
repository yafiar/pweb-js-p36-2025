const $ = (sel) => document.querySelector(sel);

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.id === 'login') initLogin();
});

function initLogin() {
  const form = $('#loginForm');
  const username = $('#username');
  const password = $('#password');
  const btn = $('#loginBtn');
  const error = $('#error');
  const success = $('#success');
  const loading = $('#loading');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';
    success.textContent = '';

    const u = (username.value || '').trim();
    const p = (password.value || '');

    if (!u) { error.textContent = 'Username tidak boleh kosong.'; return; }
    if (!p) { error.textContent = 'Password tidak boleh kosong.'; return; }

    btn.disabled = true;
    btn.textContent = 'Please wait…';
    loading.hidden = true;

    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'LOGIN_FAILED');

      try { localStorage.setItem('firstName', data.firstName || 'Friend'); } catch {}

      success.textContent = `Login successful! Welcome, ${data.firstName || 'teman'}.`;

      setTimeout(() => { window.location.href = 'recipes.html'; }, 900);
    } catch (err) {
      error.textContent = err?.message ? `Login gagal: ${err.message}` : 'Terjadi masalah koneksi ke API.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Log in';
      loading.hidden = true;
    }
  });
}
