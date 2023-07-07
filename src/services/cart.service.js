import { cartDao } from '../Dao/factory.js';

class CartService {

  getCarts = async() => {
    const carts = await cartDao.getCarts();
    return carts;
  }

  getCartById = async( cid ) => {
    const requestedCart = await cartDao.getCartById( cid );
    return requestedCart;
  }

  addCart = async() => {
    const result = await cartDao.addCart();
    return result;
  }
  
  addProductToCart = async(cid, pid, quantity) => {
    const modifiedCart = await cartDao.addProductToCart(cid, pid, quantity);
    return modifiedCart;
  }

  removeProductFromCart = async(cid, pid) => {
    const response = await cartDao.removeProductFromCart(cid, pid);
    return response;
  }

  setProductsToCart = async(cid, products) => {
    const modifiedCart = await cartDao.updateCartProducts(cid, products);
    return modifiedCart;
  }

  updateProductQuantity = async(cid, pid, quantity) => {
    const response = await cartDao.updateProductQuantity(cid, pid, quantity);
    return response;
  }

  clearCart = async( cid ) => {
    const response = await cartDao.deleteCartProducts(cid);
    return response;
  }

}

export default new CartService();