const recoverPasswordHTML = ( token ) => `
  <h1>Recuperar contraseña</h1>
  <p>Para recuperar tu contraseña, haz click en el siguiente enlace:</p>
  <a href="http://localhost:8080/resetpassword/${token}">Recuperar contraseña</a>
`;

export { recoverPasswordHTML }