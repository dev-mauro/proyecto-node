const form = document.querySelector('#form');
const quantityInput = document.querySelector('#quantity');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const URL = form.action;
  const productQuantity = Number( quantityInput.value );

  if( productQuantity == NaN || productQuantity <= 0 ){
    alert( 'Ingrese una cantidad válida' );
    return;
  }

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quantity: productQuantity,
    })
  });

  if( response.status === 200 )
    alert( 'El producto ha sido agregado correctamente al carrito' );
  else
    alert( 'El producto no pudo ser agregado al carrito' );
});