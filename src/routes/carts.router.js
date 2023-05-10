import { Router } from "express";

import cartManagerMongo from "../Dao/managers/CartManagerMongo.js";

const router = Router();
const cartManager = new cartManagerMongo();

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

export default router;