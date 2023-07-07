import { productDao } from '../Dao/factory.js';
import ProductDTO from '../Dao/dto/productDTO.js';

class ProductService {

  getProducts = async( querys ) => {
    const result = await productDao.getProducts( querys );
    return result;
  }

  getProductById = async( pid ) => {
    const requestedProduct = await productDao.getProductById( pid );
    return requestedProduct;
  }

  addProduct = async( product ) => {
    const newProduct = new ProductDTO( product );
    const result = await productDao.addProduct( newProduct );
    return result;
  }

  updateProduct = async( pid, productUpdate ) => {
    const result = await productDao.updateProduct(pid, productUpdate);
    return result;
  }

  deleteProduct = async( pid ) => {
    const result = await productDao.deleteProduct( pid );
    return result;
  }

}

export default new ProductService();