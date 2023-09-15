import crypto from 'crypto';

import userModel from "../Dao/models/user.model.js";
import { createHash, isValidPassword } from '../utils.js';
import { recoverPasswordHTML } from '../helpers/emailBody.js';
import { transporter } from '../config/gmail.config.js';

class SessionController {

  // Registro de nuevo usuario exitoso
  successRegister = async (req, res) => {
    res.status(201).send({
      status: 'success',
      message: 'user registered successfully',
    });
  }

  // Registro de nuevo usuario fallido
  failRegister = async(req, res) => {
    res.status(400).send({
      status: 'Error',
      message: 'There was an error during account registration.',
    });
  }

  // Login exitoso
  successLogin = async(req, res) => {
    const { user } = req;

    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: user.cart,
      role: user.role,
    }

    await userModel.updateOne({_id: user._id}, {last_connection: Date.now()});

    res.send({
      status: 'success',
      payload: req.session.user,
    })
  }

  // Login fallido
  failLogin = async(req, res) => {
    res.status(401).send({
      status: 'Error',
      message: 'Invalid credentials'
    })
  }

  // Cierra la sesión iniciada
  logout = async(req, res) => {
    if( req.session?.user ) {
      const { user } = req.session;
      await userModel.updateOne({email: user.email}, {last_connection: Date.now()});
    }

    req.session.destroy();
    res.send({
      status: 'success',
      message: 'logout success',
    }); 
  }

  // Github login exitoso
  successGithubLogin = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
  }

  forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if( !user ) return res.status(404).send({
      status: 'error',
      message: 'User not found',
    });

    const resetToken = await crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000;

    user.resetToken = resetToken;
    user.expireToken = resetTokenExpiration;
    await user.save();

    console.log(`/resetpassword/${resetToken}`)

    /*
    const mailOptions = {
      from: 'proyecto-node',
      to: user.email,
      subject: 'Recuperar contraseña',
      html: recoverPasswordHTML( token ),
    }
    await transporter.sendMail( mailOptions );
    */

    res.send({
      status: 'success',
      message: 'Check your email to reset your password',
    });

  }

  resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await userModel.findOne({ resetToken: token });

    // El enlace para resetear la contraseña no es válido
    if( !user ) res.status(404).send({
      status: 'error',
      message: 'Reset password request not found',
    });

    // El enlace para resetear la contraseña ha expirado
    if( user.expireToken < Date.now() ) res.status(401).send({
      status: 'error',
      message: 'Reset password request expired',
    });

    // Si la contraseña es la misma a al actual
    if( isValidPassword( user, password ) ){
      return res.status(400).send({
        status: 'error',
        message: 'New password must be different from the old one',
      });
    }

    user.password = createHash( password );
    user.resetToken = undefined;
    user.expireToken = undefined;
    await user.save();

    res.send({
      status: 'success',
      message: 'Password reset successfully',
    })

  }

}

export default new SessionController();