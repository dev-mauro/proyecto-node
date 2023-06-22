import cartManagerMongo from "../Dao/managers/CartManagerMongo.js";

const cartManager = new cartManagerMongo();

class CartService {

  getCarts = async() => {
    const carts = await cartManager.getCarts();
    return carts;
  }

  getCartById = async( cid ) => {
    const requestedCart = await cartManager.getCartById( cid );
    return requestedCart;
  }

  addCart = async() => {
    const result = await cartManager.addCart();
    return result;
  }
  
  addProductToCart = async(cid, pid, quantity) => {
    const modifiedCart = await cartManager.addProductToCart(cid, pid, quantity);
    return modifiedCart;
  }

  removeProductFromCart = async(cid, pid) => {
    const response = await cartManager.removeProductFromCart(cid, pid);
    return response;
  }

  setProductsToCart = async(cid, products) => {
    const modifiedCart = await cartManager.updateCartProducts(cid, products);
    return modifiedCart;
  }

  updateProductQuantity = async(cid, pid, quantity) => {
    const response = await cartManager.updateProductQuantity(cid, pid, quantity);
    return response;
  }

  clearCart = async( cid ) => {
    const response = await cartManager.deleteCartProducts(cid);
    return response;
  }

}

export default new CartService();