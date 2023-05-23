const registerForm = document.querySelector('#register-form');
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const passwordInput = document.querySelector('#password');
const emailInput = document.querySelector('#email');


registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = {
    first_name: firstNameInput.value,
    last_name: lastNameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  }

  try {
    
    fetch('/api/sessions/register', {
      method: 'POST',
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then( res => res.status == 201 ? window.location.replace('/products') : '');

  } catch(err) {
    console.log(err.message)
  }

});