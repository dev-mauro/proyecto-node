import { Router } from "express";

import cartManagerMongo from "../Dao/managers/CartManagerMongo.js";

const router = Router();
const cartManager = new cartManagerMongo();

// Retorna todos los carritos
router.get('/', async(req, res) => {

  const carts = await cartManager.getCarts();

  res.send({
    "status": "success",
    "carts": carts
  });

});

// Retorna el carrito con el cid especificado
router.get('/:cid', async(req, res) => {

  const { cid } = req.params;

  try{

    const requestedCart = await cartManager.getCartById( cid );

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

});

// Agrega un carrito
router.post('/', async(req, res) => {
  try {

    const result = await cartManager.addCart();

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

});

// Agrega un producto al carrito con el cid especificado
router.post('/:cid/product/:pid', async(req, res) => {

  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  try {

    const modifiedCart = await cartManager.addProductToCart(cid, pid, quantity);

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

});

// Remueve un producto del carrito con el cid especificado
router.delete('/:cid/product/:pid', async(req, res) => {

  const { cid, pid } = req.params;

  try {
    const response = await cartManager.removeProductFromCart(cid, pid);

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

});

// Establece los productos enviados en el carrito con el cid especificado
router.put('/:cid', async(req, res) => {
  
    const { cid } = req.params;
    const { products } = req.body;
  
    try {
  
      const modifiedCart = await cartManager.updateCartProducts(cid, products);
  
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
});

// Actualiza la cantidad de un producto en el carrito con el cid especificado
router.put('/:cid/product/:pid', async(req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const response = await cartManager.updateProductQuantity(cid, pid, quantity);
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
});

export default router;

// Elimina los productos del carrito con el cid especificado
router.delete('/:cid', async(req, res) => {
  const { cid } = req.params;

  try {
    const response = await cartManager.deleteCartProducts(cid);
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
});