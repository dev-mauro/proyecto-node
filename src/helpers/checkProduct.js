// Revisa si un producto existe en la lista de productos

import { ProductManager } from "../classes/ProductManager.js";

const productManager = new ProductManager();

const checkProduct = async ( req, res, next ) => {

  const { pid } = req.params;

  try {

    await productManager.getProductById( pid );
    next();

  } catch (error) {

    res.status(400).send({
      "status": "not-found",
      "message": error.message
    });

  }


}

export { checkProduct };