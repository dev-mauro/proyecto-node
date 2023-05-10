import productModel from "../models/product.model.js";

class ProductManagerMongo {

  // Retorna lista de productos
  async getProducts( limit = 0) {
    const products = await productModel.find().limit( limit );
    return products;
  }

  // Retorna el producto con el id solicitado
  async getProductById( id ) {
    const product = await productModel.findOne({_id: id});
    if(!product)
      throw new Error('product not found');

    return product; 
  }

  // Ingresa un nuevo producto
  async addProduct( newProduct ) {
    newProduct.status = newProduct.status ?? true;
    newProduct.thumbnails = newProduct.thumbnails || [];
    const result = await productModel.create( newProduct );
    return result;
  }

  // Aplica la actualizacion al producto con el id solicitado
  async updateProduct( id, update ) {
    const result = await productModel.updateOne({_id: id}, {$set: update});
    return result;
  }

  async deleteProduct( id ) {
    const result = await productModel.deleteOne({_id: id});
    return result;
  }

}

export default ProductManagerMongo;