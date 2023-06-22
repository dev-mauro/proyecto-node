import ProductManagerMongo from "../Dao/managers/ProductManagerMongo.js";

const productManager = new ProductManagerMongo();

class ProductService {

  getProducts = async( querys ) => {
    const result = await productManager.getProducts( querys );
    return result;
  }

  getProductById = async( pid ) => {
    const requestedProduct = await productManager.getProductById( pid );
    return requestedProduct;
  }

  addProduct = async( newProduct ) => {
    const result = await productManager.addProduct( newProduct );
    return result;
  }

  updateProduct = async( pid, productUpdate ) => {
    const result = await productManager.updateProduct(pid, productUpdate);
    return result;
  }

  deleteProduct = async( pid ) => {
    const result = await productManager.deleteProduct( pid );
    return result;
  }

}

export default new ProductService();