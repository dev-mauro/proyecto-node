import { Router } from "express";

import cartManagerMongo from "../Dao/managers/CartManagerMongo.js";
import cartController from '../controllers/cart.controller.js'

const router = Router();
const cartManager = new cartManagerMongo();

// Retorna todos los carritos
router.get('/', cartController.getCarts);

// Retorna el carrito con el cid especificado
router.get('/:cid', cartController.getCartById);

// Agrega un carrito
router.post('/', cartController.addCart);

// Agrega un producto al carrito con el cid especificado
router.post('/:cid/product/:pid', cartController.addProductToCart);

// Remueve un producto del carrito con el cid especificado
router.delete('/:cid/product/:pid', cartController.removeProductFromCart);

// Establece los productos enviados en el carrito con el cid especificado
router.put('/:cid', cartController.setProductsToCart);

// Actualiza la cantidad de un producto en el carrito con el cid especificado
router.put('/:cid/product/:pid', cartController.updateProductQuantity);

// Elimina todos los productos del carrito con el cid especificado
router.delete('/:cid', cartController.clearCart);

export default router;