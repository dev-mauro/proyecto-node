const loginForm = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = {
    email: emailInput.value,
    password: passwordInput.value,
  }

  try {
    
    fetch('/api/sessions/login', {
      method: 'POST',
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then( res => (res.status == 200) ? window.location.replace('/products') : '');

  } catch(err) {
    console.log(err.message)
  }

});