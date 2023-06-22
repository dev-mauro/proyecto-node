import cartService from "../services/cart.service.js";

class CartController {

  // Retorna todos los carritos
  getCarts = async(req, res) => {

    const carts = await cartService.getCarts();
  
    res.send({
      "status": "success",
      "carts": carts
    });
  
  }

  // Retorna el carrito con el cid especificado
  getCartById = async(req, res) => {
    const { cid } = req.params;
    try{

      const requestedCart = await cartService.getCartById( cid );

      res.send({
        "status": "success",
        "products": requestedCart.products
      });

    } catch(error) {

      res.status(400).send({
        "status": "not found",
        "message": error.message
      });

    }
  }

  // Agrega un carrito
  addCart = async(req, res) => {
    try {
  
      const result = await cartService.addCart();
  
      res.send({
        "status": "success",
        result,
      });
  
    } catch(error) {
  
      res.status(400).send({
        "status": "bad request",
        "message": error.message
      });
  
    }
  }

  // Agrega un producto al carrito con el cid especificado
  addProductToCart = async(req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
  
    try {
  
      const modifiedCart = await cartService.addProductToCart(cid, pid, quantity);
  
      res.send({
        "status": "success",
        modifiedCart
      });
  
    } catch(error) {
  
      res.send({
        "status": "bad request",
        "message": error.message
      });
  
    }
  }

  // Elimina un producto del carrito con el cid especificado
  removeProductFromCart = async(req, res) => {
    const { cid, pid } = req.params;
  
    try {
      const response = await cartService.removeProductFromCart(cid, pid);
  
      res.send({
        status: 'success',
        payload: response,
      });
    } catch(err) {
      res.status(400).send({
        status: 'error',
        message: err.message
      });
    }
  }

  // Establece los productos enviados en el carrito con el cid especificado
  setProductsToCart = async(req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
  
    try {
  
      const modifiedCart = await cartService.updateCartProducts(cid, products);
  
      res.send({
        "status": "success",
        payload: modifiedCart
      });
  
    } catch(error) {
  
      res.send({
        "status": "error",
        "message": error.message
      });
  
    }
  }

  // Actualiza la cantidad de un producto en el carrito con el cid especificado
  updateProductQuantity = async(req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      const response = await cartService.updateProductQuantity(cid, pid, quantity);
      res.send({
        status: 'success',
        payload: response,
      });
    } catch(error) {
      res.status(400).send({
        status: 'error',
        message: error.message
      });
    }
  }

  // Elimina todos los productos del carrito con el cid especificado
  clearCart = async(req, res) => {
    const { cid } = req.params;
  
    try {
      const response = await cartService.deleteCartProducts(cid);
      res.send({
        status: 'success',
        payload: response,
      });
    } catch(error) {
      res.status(400).send({
        status: 'error',
        message: error.message
      });
    }
  }
}

export default new CartController();