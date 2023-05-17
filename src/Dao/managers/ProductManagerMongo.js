import productModel from "../models/product.model.js";

import { getProductLink } from "../../helpers/getProductLink.js";

class ProductManagerMongo {

  // Retorna lista de productos
  async getProducts( querys = {} ) {
    const { limit = 10, page = 1, sort, category, status } = querys;

    const filter = getFilter(category, status);
    let order = getOrder( sort );

    const result = await productModel.paginate(filter, {limit, page, sort: order});
    
    return {
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    };
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

// Retorna el objeto filter para la consulta en función de la categoria y disponibilidad indicada
const getFilter = (category, status) => {
  let filter = {};
  if( category ) filter.category = category;
  if( status ) filter.status = status;

  return filter;
}

// Retorna {price: 1} o {price: -1} según el orden indicado
const getOrder = ( sort ) => {
  let order = null;
  if( sort == 'asc' ) order = {price: 1};
  if( sort == 'desc' ) order = {price: -1};

  return order;
}

export default ProductManagerMongo;