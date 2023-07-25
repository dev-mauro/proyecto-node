import cartService from "../services/cart.service.js";
import productService from "../services/product.service.js";
import userModel from "../Dao/models/user.model.js";
import ticketService from "../services/ticket.service.js";

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
      req.logger.error( error.message );
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
      req.logger.error( error.message );
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
      req.logger.error( error.message );
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
      req.logger.error( error.message );
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
      req.logger.error( error.message );
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
      req.logger.error( error.message );
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
      req.logger.error( error.message );
      res.status(400).send({
        status: 'error',
        message: error.message
      });
    }
  }

  // Finaliza la compra de un carrito
  purchase = async(req, res) => {
    let amount = 0;
    const unavailableProducts = [];

    // Se obtiene el carrito
    const { cid } = req.params;
    const cart = await cartService.getCartById( cid );

    // Si no existe el carrito indicado
    if( !cart ){
      req.logger.error( error.message );
      return res.status(400).send({
        status: 'error',
        message: 'cart does not exist'
      });
    }

    // Se obtienen los productos del carrito
    const { products } = cart;

    // Si el carrito no tiene productos
    if( products.length == 0) {
      req.logger.error( error.message );
      return res.status(400).send({
        status: 'error',
        message: 'cart is empty'
      });
    }

    // Se obtiene la información completa de los productos
    // product = id del producto, quantity = cantidad del producto
    const fullInfoProducts = products.map( async({product, quantity}) => {
      const searchedProduct = await productService.getProductById( product );
      searchedProduct.quantity = quantity;
      return searchedProduct;
    });

    // Se verifica que haya stock suficiente para cada producto
    fullInfoProducts.forEach( async( product ) => {
      // Si hay, sumar el precio y restar stock
      if( product.stock >= product.quantity ) {
        amount += product.price * product.quantity;
        await productService.updateProduct( product._id, {stock: stock - quantity} );
      } 
      else
        unavailableProducts.push(product);
    });

    // Se obtiene el email del dueño del carrito
    const { email } = await userModel.find({cart: cid});

    // Se genera el ticket de compra
    const ticket = await ticketService.addTicket( amount, email);

    res.send({
      status: 'success',
      payload: {
        unavailableProducts,
        ticket
      }
    });

  }
}

export default new CartController();