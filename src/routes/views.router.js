import { Router } from "express";
import { ProductManager } from "../classes/ProductManager.js";

const router = Router();

const productManager = new ProductManager();

router.get( '/products', async(req, res) => {
  const products = await productManager.getProducts();

  res.render('home', {
    products,
    style: 'home.css',
  } );
});

router.get( '/realtimeproducts', async(req, res) => {

  const products = await productManager.getProducts();

  res.render('realTimeProducts', {
    products,
    style: 'home.css',
    script: 'realTimeProducts.js'
  } );

});

export default router;