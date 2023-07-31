const passwordInput = document.querySelector('#password');
const resetButton = document.querySelector('#reset-button');
const infoLabel = document.querySelector('#info');
const tokenLabel = document.querySelector('#token');

const token = tokenLabel.innerHTML;

if(!token) window.location.replace('/login');

resetButton.addEventListener('click', async( event ) => {
  event.preventDefault();
  const password = passwordInput.value;

  if( !password ) return;

  const response = await fetch(`/api/sessions/resetpassword/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if( response.status === 200 ) {
    infoLabel.innerHTML = 'Se ha cambiado su contraseña</br><a href="/login">ir al inicio</a>';
  } else if( response.status === 401 ) {
    infoLabel.innerHTML = 'El enlace para restablecer la contraseña ha expirado</br><a href="/forgotpassword">ir a olvidé mi contraseña</a>';
  } else if( response.status === 400 ) {
    infoLabel.innerHTML = 'La contraseña es la misma a la actual';
  } else {
    window.location.replace('/login');
  }
});