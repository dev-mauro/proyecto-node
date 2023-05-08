// Revisa si un producto existe en la lista de productos

import productModel from "../Dao/models/product.model.js";

const checkProduct = async ( pid ) => {
  try {
    const product = await productModel.exists({_id: pid});

    return product !== null;
  } catch(err) {
    console.log(err)
  }
}

export { checkProduct };