// Revisa si un producto existe en la lista de productos

import productModel from "../Dao/models/product.model.js";

const checkProduct = async ( req, res, next ) => {
  const { pid } = req.params;

  try {
    const product = await productModel.find({__id: pid});
    
    if(product)
      next();
    
    else
      throw new Error("Product not found");

  } catch (error) {

    res.status(400).send({
      "status": "not-found",
      "message": error.message
    });

  }
}

export { checkProduct };