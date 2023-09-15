const table = document.querySelector('#table-body');
const cartId = document.querySelector('#cart-id')?.textContent || '';
const pageNumberSpan = document.querySelector('#page-number');
const previousPageButton = document.querySelector('#previous');
const nextPageButton = document.querySelector('#next');

// Retorna los productos de la API
const getProducts = async () => {
  const query = window.location.search;

  const response = await fetch(`/api/products${query}`);
  const products = await response.json();

  return products;
}

// Setea toda la información de la página de productos
const setProductPageInfo = async () => {
  const response = await getProducts();

  insertProducts( response.payload );
  
  if( response.hasPrevPage ) {
    const prevPageQuery = '/products?' + response.prevLink?.split('?')[1];
    
    previousPageButton.disabled = false;
    previousPageButton.addEventListener('click', () => {
      window.location.href = prevPageQuery;
    });
  }
  
  if( response.hasNextPage ) {
    const nextPageQuery = '/products?' + response.nextLink?.split('?')[1];

    nextPageButton.disabled = false;
    nextPageButton.addEventListener('click', () => {
      window.location.href = nextPageQuery;
    });
  }
}

// Recibe array de productos y los inserta en la tabla
const insertProducts = ( products ) => {
  products.forEach( product => {

    const row = createProductRow( product );
    table.appendChild( row );

  });
}

const createProductRow = ( product ) => {
  delete product.owner;
  delete product.__v;
  delete product.status;

  const row = document.createElement('tr');

  for(const property in product) {
    const cell = document.createElement('td');
    cell.textContent = product[ property ];
    row.appendChild( cell );
  }

  const detailsCell = document.createElement('td');
  detailsCell.innerHTML = `<a href="/products/${product._id}">Ver detalles</a>`;
  row.appendChild( detailsCell );

  const addCartCell = document.createElement('td');
  const addCartButton = document.createElement('button');
  addCartButton.textContent = 'Agregar al carrito';
  addCartButton.addEventListener('click', addProductToCart(cartId, product));
  addCartCell.appendChild( addCartButton );
  row.appendChild( addCartCell );

  return row;
}

// Retorna función que permite agregar un producto al carrito
// Recibe el id del carrito y el producto a agregar
const addProductToCart = ( cartId, { _id } ) => {
  return async () => {
    const URL = `/api/carts/${cartId}/product/${_id}`;

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: 1
      }),
    }

    const response = await fetch( URL, fetchOptions );
  
    if( response.status === 200 )
      alert('Producto agregado al carrito');
    else
      alert('Error al agregar el producto al carrito');
  }
}

setProductPageInfo();