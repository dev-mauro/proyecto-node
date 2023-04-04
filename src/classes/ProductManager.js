import { promises, existsSync } from 'fs';
const { readFile, writeFile } = promises;

/* {
    title:str,
    description:str,
    price:int,
    thumbnail:str,
    code:str,
    stock:int,
    + id:int,
  } */

class ProductManager {

  constructor( path ) {
    this.path = path || './products.json';
  }


  // Agrega un producto a la lista de productos
  async addProduct( newProduct ) {
    if(!isValidProduct( newProduct ))
      throw new Error('product is not valid');

    const products = await this.getProducts();

    if(this.checkCode( products, newProduct.code ))
      throw new Error('product code already exist');

    const lastProductId = products[products.length - 1]?.id;
    newProduct.id = lastProductId + 1 || 0;
    products.push( newProduct );
    await this.saveProducts( products );
  }


  // Lee los productos del archivo y los retorna en array
  // Si el archivo no existe retorna array vacío
  async getProducts() {
    if( !existsSync(this.path) ){
      return [];
    }

    const productsStr = await readFile(this.path, 'utf-8');
    return JSON.parse( productsStr );
  }


  // Retorna el producto del ID específicado
  async getProductById( id ) {
    id = Number( id );
    const products = await this.getProducts();
    const searchedProduct = products.find( product => product.id === id );
    if( !searchedProduct )
      throw new Error('product not found');

    return searchedProduct;
  }


  // Actualiza el producto de la lista
  async updateProduct( product ) {
    // revisa que las propiedades sean validas
    if(!reviewProductProperties( product ))
      throw new Error("Product update is not valid. It seems that the update props don't match the product props");
      
    const products = await this.getProducts();
    let productToUpdate = products.find( p => p.id === product.id );
      
    // revisa si el producto a actualizar existe
    if(!productToUpdate)
      throw new Error("Product update is not valid. It seems that there is no product with the espicified ID");
      
    for(let prop in product){
      productToUpdate[prop] = product[prop];
    }
      
    if(!isValidProduct(productToUpdate))
      throw new Error('Product update is not valid. It seems that the update props values are not valid');

    await this.saveProducts( products );   
  }


  // Elimina el producto de la lista con el id especificado
  async deleteProduct( id ) {

    const products = await this.getProducts();

    const filteredProducts = products.filter( prod => {
      if( prod.id !== id )
        return prod;
    });

    await this.saveProducts( filteredProducts );
  } 

  // Retorna true si halla un producto en la lista con el mismo code
  checkCode( products, code ) {
    return !!products.find( product => product.code === code );
  }


  // Guarda el array de productos en el archivo
  async saveProducts( products ) {
    const productsStr = JSON.stringify( products, null, '\t' );
    await writeFile(this.path, productsStr);
  }

}



// helpers

const isValidProduct = ( product ) => {
  if( !product ) return false;
  const { title, description, price, thumbnail, code, stock } = product;

  if(
    !matchType(title, 'string') ||                 //Validación titulo
    !matchType(description, 'string')  ||          //Validación descripcion
    !matchType(price, 'number') || price < 0 ||    //Validación precio
    !matchType(thumbnail, 'string') ||             //Validaicón thumbnail
    !matchType(code, 'string') ||                  //Validaicón code
    !matchType(stock, 'number', true) || stock < 0 //Validaicón stock
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
const reviewProductProperties = ( product ) => {
  if(!product.id) return false;

  const allowedProperties = [
    'title',
    'description',
    'price',
    'thumbnail',
    'code',
    'stock',
    'id',
  ];

  for (const prop in product) {
    if(!allowedProperties.find( allowed => allowed == prop))
      return false;
  }
  
  return true;
}

export { ProductManager }
