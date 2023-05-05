import { promises, existsSync } from 'fs';
const { readFile, writeFile } = promises;

/* {
    products:array[pid]
    id:int
  } */

class CartManager {

  constructor( path ) {
    this.path = path || './data/carts.json';
  }


  // Agrega un carrito a la lista de carritos
  async addCart( newCart ) {
    newCart.products = newCart.products || [];

    if(!isValidCart( newCart ))
      throw new Error('Cart is not valid');

    const carts = await this.getCarts();

    const lastCartId = carts[carts.length - 1]?.id;
    newCart.id = lastCartId + 1 || 0;
    carts.push( newCart );
    await this.saveCarts( carts );

    return newCart.id;
  }

  // Agrega a un producto a la lista del carro con el id especificado
  async addProductToCart(cid, product) {

    if(!isProductValid(product))
      throw new Error('Cart update is not valid. It seems that the new product properties are not valid');

    const carts = await this.getCarts();

    const cartToUpdate = carts.find( cart => cart.id == cid );
    
    if(!cartToUpdate)
      throw new Error("Cart update is not valid. It seems that there is no cart with the spicified ID");

    const productToModify = cartToUpdate.products.find( prod => prod.id == product.id );

    if(productToModify)
      productToModify.quantity += product.quantity;

    else
      cartToUpdate.products.push( product );

    await this.saveCarts( carts );

    return cartToUpdate;
  }


  // Lee los carritos del archivo y los retorna en array
  // Si el archivo no existe retorna array vacío
  async getCarts() {
    if( !existsSync(this.path) ){
      return [];
    }

    const CartsStr = await readFile(this.path, 'utf-8');
    return JSON.parse( CartsStr );
  }


  // Retorna el carrito del ID específicado
  async getCartById( id ) {
    id = Number( id );
    const carts = await this.getCarts();
    const searchedCart = carts.find( cart => cart.id === id );
    if( !searchedCart )
      throw new Error('It seems that there is no cart with the spicified ID');

    return searchedCart;
  }


  // Guarda el array de carritos en el archivo
  async saveCarts( carts ) {
    const cartsStr = JSON.stringify( carts, null, '\t' );
    await writeFile(this.path, cartsStr);
  }

}



// helpers

const isValidCart = ( cart ) => {

  const { products } = cart;

  return isProductsListValid( products ) && reviewCartProperties(cart);  

}

// Retorna true si la lista de thumbnails es valida
const isProductsListValid = ( products ) => {

  if( !Array.isArray(products) )
    return false;

  for(const product of products){

    if(!isProductValid(product))
      return false;
  }

  return true;

}

const isProductValid = ( product ) => {

  const { id, quantity } = product;

  if(
    !matchType(id, 'number', true) ||
    !matchType(quantity, 'number', true) || quantity < 0  
  )
    return false;

  return true;

}


// Determina si data es del tipo indicado
// canBeFalsy determina si data puede ser falsy o no ( 0 o string vacío )
const matchType = ( data, type, canBeFalsy = false ) => {
  return ( canBeFalsy )
    ? typeof data === type
    : typeof data === type && !!data
}


// Retorna true si el producto tiene la propiead ID, y además
// todas sus propiedas corresponden a propiedas de productos
const reviewCartProperties = ( product ) => {
  const allowedProperties = [
    'products'
  ];

  for (const prop in product) {
    if(!allowedProperties.find( allowed => allowed == prop))
      return false;
  }
  
  return true;
}

export { CartManager }
