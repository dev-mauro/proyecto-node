import { Router } from "express";

import ProductManagerMongo from "../Dao/managers/ProductManagerMongo.js";

const router = Router();
const productManager = new ProductManagerMongo();

router.get( '/products', async(req, res) => {
  const response = await productManager.getProducts();
  const products = response.map( product => product.toObject());

  res.render('home', {
    products,
    style: 'home.css',
  } );
});

router.get( '/realtimeproducts', async(req, res) => {
  const response = await productManager.getProducts();
  const products = response.map( product => product.toObject());

  res.render('realTimeProducts', {
    products,
    style: 'home.css',
    script: 'realTimeProducts.js'
  } );

});

export default router;