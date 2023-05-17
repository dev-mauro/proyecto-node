import { Router } from "express";

import ProductManagerMongo from "../Dao/managers/ProductManagerMongo.js";
import CartManagerMongo from "../Dao/managers/CartManagerMongo.js";
import { getProductLink } from "../helpers/getProductLink.js";

const router = Router();
const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

router.get( '/products', async(req, res) => {
  const response = await productManager.getProducts( req.query );
  const products = response.payload.map( product => product.toObject());
  const baseURL = 'http://localhost:8080/products'

  const prevLink = response.hasPrevPage ? 
    getProductLink(req.query, response.prevPage, baseURL) : null;
  const nextLink = response.hasNextPage ?
    getProductLink(req.query, response.nextPage, baseURL) : null;

  res.render('home', {
    products,
    style: 'home.css',
    script: 'productView',
    hasNextPage: response.hasNextPage,
    hasPrevPage: response.hasPrevPage,
    nextPage: response.nextPage,
    previousPage: response.previousPage,
    page: response.page,
    prevLink,
    nextLink,
  } );
});

router.get( '/realtimeproducts', async(req, res) => {
  const response = await productManager.getProducts();
  const products = response.payload.map( product => product.toObject());

  res.render('realTimeProducts', {
    products,
    style: 'home.css',
    script: 'realTimeProducts.js'
  } );

});

router.get('/products/:id', async(req, res) => {
  const { id } = req.params;
  const product = await productManager.getProductById(id);

  res.render('productDetail', {
    product: product.toObject(),
  });
});

router.get('/carts/:cid', async(req, res) => {
  const { cid } = req.params;
  const response = await cartManager.getCartById(cid);

  console.log(response)

  const products = response.products.map( product => product.toObject());

  res.render('cart', {
    products,
    style: 'home.css'
  });
});

export default router;