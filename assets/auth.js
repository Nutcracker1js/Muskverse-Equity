const loginForm = document.querySelector('.auth-form');

loginForm?.addEventListener('submit', (event) => {
  const username = document.querySelector('#signin-username');
  const password = document.querySelector('#signin-password');
  const hasInput = Boolean(username?.value.trim()) && Boolean(password?.value.trim());

  if (hasInput) {
    window.location.href = 'body/dashboard.html';
  }
});
