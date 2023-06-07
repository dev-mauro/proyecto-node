import { Router } from "express";

import userModel from "../Dao/models/user.model.js";
import { getUserRole } from "../helpers/getUserRole.js"
import passport from "passport";

const router = Router();

router.post('/register', passport.authenticate('register',
  { failureRedirect: '/api/sessions/failregister' }
  ),
  async (req, res) => {
    res.status(201).send({
      status: 'success',
      message: 'user registered successfully',
    });
  }
);

router.get('/failregister', async(req, res) => {
  res.status(400).send({
    status: 'Error',
    message: 'There was an error during account registration.',
  });

});

router.post('/login', passport.authenticate('login',
  { failureRedirect: '/api/sessions/faillogin' }
  ),
  async(req, res) => {
    const { user } = req;

    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: user.cart,
      role: user.role,
    }

    res.send({
      status: 'success',
      payload: req.session.user,
    })
  }
);

router.get('/faillogin', async(req, res) => {
  res.status(401).send({
    status: 'Error',
    message: 'Invalid credentials'
  })
});

router.delete('/logout', async(req, res) => {
  req.session.destroy();
  res.send({
    status: 'success',
    message: 'logout success',
  }); 
});

router.get('/github', passport.authenticate('github', {scope: ['user:email']},
  async(req, res) => {}
));

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
  }
)

export default router;