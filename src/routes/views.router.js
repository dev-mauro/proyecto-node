import { Router } from "express";

import productModel from "../Dao/models/product.model.js";

const router = Router();
router.get( '/products', async(req, res) => {
  const response = await productModel.find();
  const products = response.map( product => product.toObject());

  res.render('home', {
    products,
    style: 'home.css',
  } );
});

router.get( '/realtimeproducts', async(req, res) => {
  const response = await productModel.find();
  const products = response.map( product => product.toObject());

  res.render('realTimeProducts', {
    products,
    style: 'home.css',
    script: 'realTimeProducts.js'
  } );

});

export default router;