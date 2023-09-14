import cartModel from "../models/cart.model.js";

import { checkProduct } from "../../helpers/checkProduct.js";

class CartManagerMongo {

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
    let product = currentCartProducts.find( product => product.product == pid );

    // Si existe, se le agrega la cantidad
    if( product )
      product.quantity += quantity;

    // Si no existe, se agrega el producto al carrito
    else
      currentCartProducts.push({product: pid, quantity});

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
    const cart = await cartModel.findOne({_id: cid}).populate('products.product');
    return cart;
  }

  // Remueve un producto del carrito con el cid especificado
  async removeProductFromCart( cid, pid ) {
    const cart = await cartModel.findOne({_id: cid});
    if(!cart) throw new Error('cart does not exist');
    
    const { products } = cart;

    const productIndex = products.findIndex( product => product.product == pid );
    if(productIndex == -1) throw new Error('product not found in cart');
    
    products.splice(productIndex, 1);
    
    const result = await cartModel.updateOne({_id: cid}, {$set: {products: products}});
    
    return result;
  }
  
  // Establece los productos enviados en el carrito con el cid especificado
  async updateCartProducts(cid, products) {
    const cart = await cartModel.findOne({_id: cid});
    if(!cart) throw new Error('cart does not exist');

    for(let { product:pid } of products) {
      const productExist = await checkProduct( pid );
      if( !productExist )
        throw new Error(`product ${pid} does not exist`);
    }

    const result = await cartModel.updateOne({_id: cid}, {$set: {products}});

    return result;

  }

  // Actualiza la cantidad de un producto en el carrito con el cid especificado
  async updateProductQuantity(cid, pid, quantity) {
    const cart = await cartModel.findOne({_id: cid});
    if(!cart) throw new Error('cart does not exist');

    const { products } = cart;
    const product = products.find( product => product.product == pid );
    if( !product ) throw new Error('product not found in cart');

    product.quantity = quantity;

    const result = await cartModel.updateOne({_id: cid}, {$set: {products: products}});

    return result;
  }

  // Elimina todos los productos del carrito especificado
  async deleteCartProducts(cid) {
    const cart = await cartModel.findOne({_id: cid});
    if(!cart) throw new Error('cart does not exist');

    const result = await cartModel.updateOne({_id: cid}, {$set: {products: []}});

    return result;
  }

}

export { CartManagerMongo };