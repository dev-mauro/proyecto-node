const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", (e) => {
  fetch('/api/sessions/logout', {
    method: 'DELETE',
  })
  .then( res => (res.status == 200) ? window.location.replace('/login') : '');
});