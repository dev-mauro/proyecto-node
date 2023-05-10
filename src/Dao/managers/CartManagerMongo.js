import cartModel from "../models/cart.model.js";

import { checkProduct } from "../../helpers/checkProduct.js";

class cartModelMongo {

  // Inserta un nuevo carrito
  async addCart() {
    const cart = await cartModel.create({products: []});
    return cart;
  }


  // Inserta un producto en el carrito con el cid especificado
  async addProductToCart( cid, pid, quantity = 1 ) {
    const productExist = await checkProduct( pid );

    if(!productExist)
      throw new Error('Product does not exist');

    // se obtienen el carrito con el cid especificado
    const cart = await cartModel.findOne({_id: cid});
    if(cart === null)
      throw new Error("Cart id does not exist");

    const { products: currentCartProducts } = cart;


    // Se revisa si el producto que se quiere agregar ya existe en el carrito
    let product = currentCartProducts.find( product => product.id === pid );

    // Si existe, se le agrega la cantidad
    if( product )
      product.quantity += quantity;

    // Si no existe, se agrega el producto al carrito
    else
      currentCartProducts.push({id: pid, quantity});

    const result = await cartModel.updateOne({_id: cid}, {$set: {products: currentCartProducts}});

    return result;
  }


  // Retorna todos los carritos
  async getCarts() {
    const carts = await cartModel.find();
    return carts;
  }


  // Retorna el carrito con el cid especificado
  async getCartById( cid ) {
    const cart = await cartModel.find({_id: cid});
    return cart;
  }

}

export default cartModelMongo;