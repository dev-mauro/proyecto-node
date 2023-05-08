import { Router } from "express";

import CartModel from "../Dao/models/cart.model.js";
import { checkProduct } from "../helpers/checkProduct.js";
import cartModel from "../Dao/models/cart.model.js";

const router = Router();

router.get('/', async(req, res) => {

  const carts = await CartModel.find();

  res.send({
    "status": "success",
    "carts": carts
  });

});

router.get('/:cid', async(req, res) => {

  const { cid } = req.params;

  try{

    const requestedCart = await cartModel.find({_id: cid});

    res.send({
      "status": "success",
      "cart": requestedCart
    });

  } catch(error) {

    res.status(400).send({
      "status": "not found",
      "message": error.message
    });

  }

});

router.post('/', async(req, res) => {

  const newCart = req.body;

  try {

    const result = await cartModel.create( newCart );

    res.send({
      "status": "success",
      "newCart": {
        result,
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

router.post('/:cid/product/:pid', async(req, res) => {

  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  const productExist = await checkProduct( pid );

  if(!productExist)
    return res.send({
      "status": "not found",
      "message": "product not found"
    });

  try {

    const { products: currentCartProducts } = await cartModel.findOne({_id: cid});
    let product = currentCartProducts.find( product => product.id === pid );
    
    if( product )
      product.quantity += quantity;
    else
      currentCartProducts.push({id: pid, quantity});

    const result = await cartModel.updateOne({_id: cid}, {$set: {products: currentCartProducts}});

    res.send({
      "status": "success",
      "modifiedCart": result
    });

  } catch(error) {

    res.send({
      "status": "bad request",
      "message": error.message
    });

  }

});

export default router;