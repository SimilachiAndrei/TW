document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('form');
  const inputs = document.querySelectorAll('.user-box input');
  const loginButton = loginForm.querySelector('a');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentNode.classList.add('focus');
    });

    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.parentNode.classList.remove('focus');
      }
    });
  });

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const username = loginForm.querySelector('[name="username"]').value;
    const password = loginForm.querySelector('[name="password"]').value;

    if (username === '' || password === '') {
      alert('Please enter both username and password.');
    } else {
      window.location.href = 'afterlog.html';
    }
  });
});