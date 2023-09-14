const cartId = document.querySelector('#cart-id').textContent || '';
const table = document.querySelector('#table');
const purchaseButton = document.querySelector('#purchase-button');
const clearCartButton = document.querySelector('#clearCart-button');
const purchaseDetails = document.querySelector('#purchase-details');

// Establece toda la información en pantalla
const setPageInfo = async () => {
  const products = await getCart();

  renderCart( products );
}

// Retorna el carrito con el cid especificado
const getCart = async ( ) => {
  const response = await fetch('/api/carts/' + cartId);
  const { products } = await response.json();

  return products;
}


// Renderiza la tabla de productos
const renderCart = ( products ) => {
  table.innerHTML = '';
  products.forEach( product => {
    table.appendChild( getTableRow( product ) );
  });

}

// Retorna el tr de un producto
const getTableRow = ( {product, quantity} ) => {
  delete product.owner;
  delete product.__v;
  delete product.status;
  delete product.thumbnails;

  const row = document.createElement('tr');

  for(const prop in product) {
    const dataCell = document.createElement('td');
    dataCell.textContent = product[ prop ];
    row.appendChild( dataCell );
  }

  const quantityCell = document.createElement('td');
  quantityCell.textContent = quantity;
  row.appendChild( quantityCell );

  const removeProductCell = document.createElement('td');
  const removeProductButton = document.createElement('button');
  removeProductButton.textContent = 'X';

  removeProductButton.addEventListener('click', getRemoveProduct( cartId, product ));

  removeProductCell.appendChild( removeProductButton );
  row.appendChild( removeProductCell );

  return row;
}

// Retorna la una función que elemina el producto indicado
// del carrito con el cid especificado
const getRemoveProduct = (cardId, {_id}) => {
  return async () => {
    await fetch(`/api/carts/${cartId}/product/${_id}`, {
      method: 'DELETE'
    });
    
    setPageInfo();
  }
}

// Añade evento para finalizar la compra
purchaseButton.addEventListener('click', async ( ) => {
  const response = await fetch(`/api/carts/${cartId}/purchase`, {
    method: 'POST',
  });

  if( response.status == 200 ) alert('Compra realizada exitosamente');
  else if( response.status == 400 ) return alert('El carrito está vacío');
  else if( response.status == 409 ) return alert('Los productos no tienen stock suficiente');
  else return alert('Error al realizar la compra');

  const { payload } = await response.json();
  const { ticket, unavailableProducts } = payload;

  purchaseDetails.innerHTML = `
    <h3>Detalles de la compra</h3>
    <p>Monto Total: $${ticket.amount}</p>
    <p>Fecha: ${new Date(ticket.purchase_datetime)}</p>
    <p>Comprador: ${ticket.purchaser}</p>
  `;

  if( unavailableProducts.length > 0 ) {
    purchaseDetails.innerHTML += `
      <h3>${unavailableProducts.length} Productos sin stock suficiente</h3>
    `
    unavailableProducts.forEach( product => {
      purchaseDetails.innerHTML += `
        <p>${product.title} - ${product.stock} unidades disponibles</p>
      `
    });
  }

  setPageInfo( );
});

// Añade evento para vacíar el carrito
clearCartButton.addEventListener('click', async ( ) => {
  const { status } = await fetch(`/api/carts/${cartId}`, {
    method: 'DELETE',
  });

  if( status == 200 ) {
    alert('Carrito vaciado exitosamente');
    setPageInfo();
  }
  else alert('Error al vaciar el carrito');
});

setPageInfo();