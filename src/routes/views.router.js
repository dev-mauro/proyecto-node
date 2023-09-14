import { Router } from "express";

import { productDao, cartDao } from "../Dao/factory.js";
import { getProductLink } from "../helpers/getProductLink.js";
import { publicRoute, privateRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get( '/products', async(req, res) => {
  const { user } = req.session;

  res.render('home', {
    style: 'home',
    script: 'productView',
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

  const { user } = req.session;

  res.render('productDetail', {
    product: product.toObject(),
    user,
    script: 'productDetails'
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

router.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword', {
    script: 'forgotpassword',
  });
})

router.get('/resetpassword/:token', (req, res) => {
  const { token } = req.params;

  res.render('resetpassword', {
    script: 'resetpassword',
    token,
  });
});


// Vista de administrador que permite modificar los usuarios
router.get('/manageusers', adminRoute,(req, res) => {
  if( req.authorized )
    return res.render('manageusers', {
      script: 'manageusers',
      style: 'home'
    });

  res.redirect('/login');
});


// Vista del carrito
router.get('/cart', privateRoute, (req, res) => {

  const { user } = req.session;

  res.render('cart', {
    style: 'home',
    script: 'cart',
    cid: user.cart,
  });

});

export default router;
