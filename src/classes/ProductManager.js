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
    newProduct.status = newProduct.status ?? true;
    newProduct.thumbnails = newProduct.thumbnails || [];

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
  async updateProduct( id, update ) {
    // revisa que las propiedades sean validas
    if(!reviewProductProperties( update ))
      throw new Error("Product update is not valid. It seems that the update props don't match the product props");
      
    const products = await this.getProducts();
    let productToUpdate = products.find( p => p.id == id );
    // revisa si el producto a actualizar existe
    if(!productToUpdate)
      throw new Error("Product update is not valid. It seems that there is no product with the spicified ID");
      
    for(let prop in update){
      productToUpdate[prop] = update[prop];
    }
      
    if(!isValidProduct(productToUpdate))
      throw new Error('Product update is not valid. It seems that the update props values are not valid');

    await this.saveProducts( products );   
  }


  // Elimina el producto de la lista con el id especificado
  async deleteProduct( id ) {

    const products = await this.getProducts();

    const filteredProducts = products.filter( prod => {
      if( prod.id != id )
        return prod;
    });

    if(filteredProducts.length === products.length)
      throw new Error('Product delete is not valid. It seems that there is no product with the spicified ID');

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
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails 
  } = product;

  if(
    !matchType(title, 'string') ||                    //Validación titulo
    !matchType(description, 'string')  ||             //Validación descripcion
    !matchType(code, 'string') ||                     //Validaicón code
    !matchType(price, 'number') || price < 0 ||       //Validación precio
    !matchType(status, 'boolean', true) ||            //Validación estado
    !matchType(stock, 'number', true) || stock < 0 || //Validaicón stock
    !matchType(category, 'string') ||                 //Validación categoria
    !isValidThumbnails(thumbnails)                    //Validación thumbnails
  ) 
    return false;
    
  return true;
}

// Retorna true si la lista de thumbnails es valida
const isValidThumbnails = ( thumbnailList ) => {

  if( !Array.isArray(thumbnailList) )
    return false;

  for(const thumb of thumbnailList)
    if( !matchType(thumb, 'string') )
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
  const allowedProperties = [
    'title',
    'description',
    'code',
    'price',
    'status',
    'stock',
    'category',
    'thumbnails',
  ];

  for (const prop in product) {
    if(!allowedProperties.find( allowed => allowed == prop))
      return false;
  }
  
  return true;
}

export { ProductManager }
