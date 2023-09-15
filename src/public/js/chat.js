const socket = io();

const form = document.querySelector('#form');
const chat = document.querySelector('#chatlog');

const userEmailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');

socket.on('new-message', (newMessage) => {
  chat.innerHTML += `<p>${newMessage.user}: ${newMessage.message}\n</p>`
});

form.onsubmit = (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const email = userEmailInput.value;

  if(email && message)
    fetch('/chat', {
      method: 'POST',
      body: JSON.stringify({
        user: email,
        message
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
}