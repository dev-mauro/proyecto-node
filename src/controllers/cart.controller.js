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
      res.status(404).send({
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

    const { role, email } = req.session.user || {};
  
    try {
  
      if( role === 'premium' ) {
        const { owner } = await productService.getProductById( pid );
        if( owner == email )
          return res.status(400).send({
            "status": "error",
            "message": "You can't add your own product to your cart"
          });
      }

      const modifiedCart = await cartService.addProductToCart(cid, pid, quantity);
  
      res.send({
        "status": "success",
        modifiedCart
      });
  
    } catch(error) {
      req.logger.error( error.message );
      res.status(404).send({
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
      req.logger.error( err.message );
      res.status(404).send({
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
      res.status(404).send({
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
      res.status(404).send({
        status: 'error',
        message: error.message
      });
    }
  }

  // Elimina todos los productos del carrito con el cid especificado
  clearCart = async(req, res) => {
    const { cid } = req.params;
  
    try {
      const response = await cartService.clearCart(cid);
      res.send({
        status: 'success',
        payload: response,
      });
    } catch(error) {
      req.logger.error( error.message );
      res.status(404).send({
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
      req.logger.error( 'cart does not exist' );
      return res.status(404).send({
        status: 'error',
        message: 'cart does not exist'
      });
    }

    // Se obtienen los productos del carrito
    const { products } = cart;

    // Si el carrito no tiene productos
    if( products.length == 0) {
      req.logger.error( 'cart is empty' );
      return res.status(400).send({
        status: 'error',
        message: 'cart is empty'
      });
    }

    // Se obtiene la información completa de los productos
    // product = id del producto, quantity = cantidad del producto
    let fullInfoProducts = products.map( async({product, quantity}) => {
      const searchedProduct = await productService.getProductById( product );
      searchedProduct.quantity = quantity;
      return searchedProduct;
    });

    fullInfoProducts = await Promise.all( fullInfoProducts );

    // Se verifica que haya stock suficiente para cada producto
    fullInfoProducts.forEach( ( product ) => {
      // Si hay, sumar el precio y restar stock
      const { stock, quantity } = product;
      if( stock >= quantity ) {
        amount += product.price * product.quantity;
        productService.updateProduct( product._id, {stock: stock - quantity} );
      } 
      else
        unavailableProducts.push(product);
    });

    // Si no hay stock para ningún producto
    if( unavailableProducts.length == products.length )
      return res.status(409).send({
        status: 'error',
        message: 'there is no stock for any product'
      });

    // Se obtiene el email del dueño del carrito
    const { email } = await userModel.findOne({cart: cid});

    // Se genera el ticket de compra
    const ticket = await ticketService.addTicket( amount, email);

    // Se vacía el carrito
    await cartService.clearCart( cid );

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