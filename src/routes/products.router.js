import { Router } from "express";

import ProductManagerMongo from "../Dao/managers/ProductManagerMongo.js";
import { emitChangeInProducts } from "../helpers/emitChangeInProducts.js";

const router = Router();
const productManager = new ProductManagerMongo();

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
    res.send( {product: requestedProduct} );

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
    });

    emitChangeInProducts( req );

  } catch (error) {
    res.status(400).send({
      "status": "bad request",
      "message": error.message

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

    emitChangeInProducts( req );

  } catch(error) {
    res.status(400).send({
      "status": "bad request",
      "message": error.message
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

    emitChangeInProducts( req );

  } catch(error) {
    res.send({
      "status": "not found",
      "message": error.message
    });
  }

});

export default router;