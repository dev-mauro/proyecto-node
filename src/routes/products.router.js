import { Router } from "express";

import ProductManagerMongo from "../Dao/managers/ProductManagerMongo.js";
import { emitChangeInProducts } from "../helpers/emitChangeInProducts.js";
import { getProductLink } from "../helpers/getProductLink.js";

const router = Router();
const productManager = new ProductManagerMongo();

// Lista todos los productos. Acepta ?limit query.
router.get('/', async(req, res) => {

  const result = await productManager.getProducts( req.query );

  const prevLink = result.hasPrevPage ? 
    getProductLink(req.query, result.prevPage) : null;
  const nextLink = result.hasNextPage ?
    getProductLink(req.query, result.nextPage) : null;

  res.send( JSON.stringify({
    status: "success",
    ...result,
    prevLink,
    nextLink,
  }) );

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