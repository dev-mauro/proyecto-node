import { Router } from "express";

import { CartManager } from "../Dao/managers/CartManager.js";
import { checkProduct } from "../helpers/checkProduct.js";

const router = Router();

const cartManager = new CartManager();

router.get('/', async(req, res) => {

  const carts = await cartManager.getCarts();

  res.send({
    "status": "success",
    "carts": carts
  });

});

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
      "status": "not foud",
      "message": error.message
    });

  }

});

router.post('/', async(req, res) => {

  const newCart = req.body;

  try {

    const id = await cartManager.addCart( newCart );

    res.send({
      "status": "success",
      "newCart": {
        id,
        ...newCart
      }
    });

  } catch(error) {

    res.status(400).send({
      "status": "bad request",
      "message": error.message
    });

  }

});

router.post('/:cid/product/:pid', checkProduct, async(req, res) => {

  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  const product = {id: Number(pid), quantity}

  try {

    const modifiedCart = await cartManager.addProductToCart(cid, product);

    res.send({
      "status": "success",
      "modifiedCart": modifiedCart
    });

  } catch(error) {

    res.send({
      "status": "bad request",
      "message": error.message
    });

  }

});

export default router;