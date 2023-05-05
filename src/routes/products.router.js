import { Router } from "express";

import productModel from "../Dao/models/product.model.js";
import { emitChangeInProducts } from "../helpers/emitChangeInProducts.js";

const router = Router();

// Lista todos los productos. Acepta ?limit query.
router.get('/', async(req, res) => {
  const limit = req.query.limit ?? 0;
  const products = await productModel.find().limit(limit);
  
  res.send({
    status: "success",
    products,
  });
});

// Lista el producto con el pID solicitado
router.get('/:pid', async(req, res) => {

  const { pid } = req.params;

  const product = await productModel.findOne({_id: pid});

  if(!product)
    res.status(400).send({
      "status": "not-found",
      "message": "product not found"
    });

  else
    res.send({
      "status": "success",
      product
    });
});

// Ingresa un nuevo producto
router.post('/', async(req, res) => {
  const newProduct = req.body;

  // Si no hay status, se setea en true
  newProduct.status = newProduct.status ?? true;
  // Si no hay thumbnails, se setea en []
  newProduct.thumbnail = newProduct.thumbnail || [];

  try {
    const result = await productModel.create(newProduct);
    res.send({
      "status": "success",
      "newProduct": result
    });

    emitChangeInProducts( req );
  } catch(err) {
    res.status(400).send({
      "status": "bad request",
      "message": err.message
    });
  }
});

// Actualiza el producto con el pID solicitado
router.put('/:pid', async(req, res) => {
  const productUpdate = req.body;
  const { pid } = req.params;

  try {
    const result = await productModel.updateOne({_id: pid}, {$set: productUpdate});

    if(result.acknowledged) {
      res.send({
        "status": "success",
        "update": result,
      });  
      emitChangeInProducts( req );
    } else {
      res.status(500).send({
        "status": "bad request",
        result
      });
    }

  } catch(err) {
    res.status(400).send({
      "status": "not found",
      "message": err.message
    });
  }
});

// Elimina un producto con el pID solicitado
router.delete('/:pid', async(req, res) => {
  const { pid } = req.params;

  try {
    const result = await productModel.deleteOne({_id: pid});

    if(result.deletedCount > 0){
      res.send({
        "status": "success",
        "result": {
          "deletedID": pid,
          result
        }
      });
      emitChangeInProducts( req );
    } else {
      res.status(400).send({
        "status": "not found",
        result
      });
    }

  } catch (err) {
    res.status(500).send({
      "status": "bad request",
      "message": err
    });
  }
});

export default router;