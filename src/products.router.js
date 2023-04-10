import { Router } from "express";

import { ProductManager } from "./classes/ProductManager.js"

const router = Router();

const productManager = new ProductManager();

// Lista todos los productos. Acepta ?limit query.
router.get('/', async(req, res) => {

  const { limit } = req.query;
  const products = await productManager.getProducts();
  
  if(!limit) return res.send( JSON.stringify({ products }) );

  res.send( JSON.stringify({products: products.slice(0, limit)}) );

});

// Lista el producto con el pID solicitado
router.get('/:pid', async(req, res) => {

  const { pid } = req.params;

  try {

    const requestedProduct = await productManager.getProductById( pid );
    res.send( JSON.stringify({product: requestedProduct}) );

  } catch( error ) {

    res.status(400).send({
      "status": "not-found",
      "message": error.message
    });
  
  }

});

router.post('/', async(req, res) => {

  const newProduct = req.body;

  try {
    await productManager.addProduct( newProduct );

    res.send({
      "status": "success",
      "newProduct": newProduct
    })

  } catch (error) {
    res.status(400).send({
      "status": "bad request",
      "messagge": error.message

    });
  }

});

router.put('/:pid', async(req, res) => {

  const productUpdate = req.body;
  const { pid } = req.params;

  try {

    await productManager.updateProduct(pid, productUpdate);
    res.send({
      "status": "success",
      "update": {
        id: pid,
        ...productUpdate
      },
    });

  } catch(error) {
    res.status(400).send({
      "status": "bad request",
      "messagge": error.message
    });
  }

});

router.delete('/:pid', async(req, res) => {

  const { pid } = req.params;

  try {

    await productManager.deleteProduct( pid );
    res.send({
      "status": "success",
      "deletedID": pid
    });

  } catch(error) {
    res.send({
      "status": "not found",
      "messagge": error.message
    });
  }

});

export default router;