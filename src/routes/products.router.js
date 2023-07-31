import { Router } from "express";

import productController from '../controllers/products.controller.js'
import { premiumRoute } from "../middlewares/auth.middleware.js";

const router = Router();

// Lista todos los productos. Acepta ?limit query.
router.get('/', productController.getProducts);

// Lista el producto con el pID solicitado
router.get('/:pid', productController.getProductById);

// Agrega un producto a la base de datos
router.post('/', productController.addProduct);

// Actualiza un producto de la base de datos
router.put('/:pid', premiumRoute, productController.updateProduct);

// Elimina un producto de la base de datos
router.delete('/:pid', premiumRoute, productController.deleteProduct);

export default router;