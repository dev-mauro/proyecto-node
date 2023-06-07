const registerForm = document.querySelector('#register-form');
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const passwordInput = document.querySelector('#password');
const emailInput = document.querySelector('#email');
const ageInput = document.querySelector('#age');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = {
    first_name: firstNameInput.value,
    last_name: lastNameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    age: ageInput.value,
  }

  try {
    
    fetch('/api/sessions/register', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if( res.status == 201) window.location.replace('/login');
      else if ( res.status == 400 ) console.log('Registration error');
      else return res.json();
    })
    .then( json => console.log(json) )

  } catch(err) {
    console.log(err.message)
  }

});