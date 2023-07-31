const emailInput = document.querySelector('#email');
const resetButton = document.querySelector('#reset-button');
const infoLabel = document.querySelector('#info');


resetButton.addEventListener('click', async( event ) => {
  event.preventDefault();
  const email = emailInput.value;

  if( !email ) return;

  const response = await fetch('/api/sessions/forgotpassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if( response.status === 200 ) {
    infoLabel.innerHTML = 'Se ha enviado un correo a tu cuenta para restablecer tu contraseña</br><a href="/login">ir al inicio</a>';
  } else {
    window.location.replace('/login');
  }
});