import { Router } from "express";

import { productDao, cartDao } from "../Dao/factory.js";
import { getProductLink } from "../helpers/getProductLink.js";
import { publicRoute, privateRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get( '/products', async(req, res) => {
  const response = await productDao.getProducts( req.query );

  if( !response.payload ){
    return res.render('home', {
     products: response,
     style: 'home',
   });
  }

  const products = response.payload.map( product => product.toObject());
  const baseURL = 'http://localhost:8080/products';
  const { user } = req.session;

  const prevLink = response.hasPrevPage ? 
    getProductLink(req.query, response.prevPage, baseURL) : null;
  const nextLink = response.hasNextPage ?
    getProductLink(req.query, response.nextPage, baseURL) : null;

  res.render('home', {
    products,
    style: 'home',
    script: 'productView',
    hasNextPage: response.hasNextPage,
    hasPrevPage: response.hasPrevPage,
    nextPage: response.nextPage,
    previousPage: response.previousPage,
    page: response.page,
    prevLink,
    nextLink,
    user,
  } );
});

router.get( '/realtimeproducts', async(req, res) => {
  const response = await productDao.getProducts();
  const products = response.payload.map( product => product.toObject());

  res.render('realTimeProducts', {
    products,
    style: 'home',
    script: 'realTimeProducts.js'
  } );

});

router.get('/products/:id', async(req, res) => {
  const { id } = req.params;
  const product = await productDao.getProductById(id);

  res.render('productDetail', {
    product: product.toObject(),
  });
});

router.get('/carts/:cid', async(req, res) => {
  const { cid } = req.params;
  const response = await cartDao.getCartById(cid);

  console.log(response)

  const products = response.products.map( product => product.toObject());

  res.render('cart', {
    products,
    style: 'home'
  });
});

// Vistar de login, register y profile

router.get('/register', publicRoute, (req, res) => {
  res.render('register', {
    style: 'forms',
    script: 'register'
  });
});

router.get('/login', publicRoute, (req, res) => {
  res.render('login', {
    style: 'forms',
    script: 'login'
  });
});

router.get('/profile', privateRoute, (req, res) => {
  const { user } = req.session;

  res.render('profile', {
    style: 'forms',
    script: 'profile',
    user,
  });
});

router.get('/current', (req, res) => {
  const { user } = req.session;

  if( !user ) return res.status(401).send({status: 'error', message: 'not authenticated'});

  res.send({
    status: 'success',
    payload: req.session.user,
  })
})

export default router;