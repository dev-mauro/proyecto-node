import { Router } from "express";

import userModel from "../Dao/models/user.model.js";
import { getUserRole } from "../helpers/getUserRole.js"

const router = Router();

router.post('/register', async(req, res) => {
  const { user } = req.body;

  try {
    const userExist = await userModel.findOne({ email: user.email });
    if(userExist) res.status(409).send({
      status: 'error',
      message: 'user already exist',
    })

    const role = getUserRole(user);
    const newUser = await userModel.create( {...user, role} );

    const sessionUser = {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
    }

    req.session.user = sessionUser;

    res.status(201).send({
      status: 'success',
      payload: sessionUser,
    });

  } catch(err) {
    console.log(err.message);
    res.send({
      status: 'error',
      message: err.message,
    });
  }
});

router.post('/login', async(req, res) => {
  const { user } = req.body;

  try {
    const requestedUser = await userModel.findOne({email: user.email});

    if(!requestedUser) {
      return res.status(401).send({
        status: 'error',
        message: 'user not found'
      })
    }

    if(requestedUser.password !== user.password)
      return res.status(401).send({
        status: 'error',
        message: 'wrong password'
      })  
      
    const sessionUser = {
      first_name: requestedUser.first_name,
      last_name: requestedUser.last_name,
      email: requestedUser.email,
      role: requestedUser.role,
    }

    req.session.user = sessionUser;

    res.send({
      status: 'success',
      payload: sessionUser,
    });

  } catch(err) {

    res.status(400).send({
      status: 'error',
      message: err.message,
    })

  } 

});

router.delete('/logout', async(req, res) => {
  req.session.destroy();
  res.send({
    status: 'success',
    message: 'logout success',
  }); 
});

export default router;