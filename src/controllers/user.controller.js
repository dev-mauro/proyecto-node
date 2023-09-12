import { de } from "@faker-js/faker";
import { transporter } from '../config/gmail.config.js';

import userModel from "../Dao/models/user.model.js";

// Tipos de documentos permitidos
const availableDocuementTypes = [
  'dni', 'address', 'accountStatus'
]

class UserController {

  async uploadDocuments(req, res) {
    try {
      const { uid } = req.params;
      const { filename } = req.file;
      const { documentType } = req.body;

      if( documentType && !availableDocuementTypes.includes(documentType) ){
        return res.status(400).send({
          status: 'error',
          message: 'Invalid document type',
        });
      }

      const result = await userModel.updateOne(
        { _id: uid },
        { $push: {
          documents: {
            name: documentType,
            reference: filename 
            }
          } 
        }
      );
  
      if (result.nModified === 0) {
        return res.status(400).send({
          status: 'error',
          message: 'User not found or document update failed',
        });
      }
  
      res.send({
        status: 'success',
        message: 'Document uploaded',
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: 'An error occurred while uploading the document',
      });
    }
  }

  // Cambia el rol de un usuario de 'premium' a 'user' y viceversa
  togglePremium = async( req, res ) => {
    const { uid } = req.params;

    try {
      const user = await userModel.findById( uid );

      if( !user )
        return res.status(404).send({
          status: 'error',
          message: 'User not found',
        });

      if( user.role == 'admin' )
        return res.status(400).send({
          status: 'error',
          message: 'Admin users cannot be premium',
        });

      const { documents: userDocuments } = await userModel.findById( uid, { documents: 1 } );

      const documentsNames = userDocuments.map( document => document.name );

      // Si el usuario no tiene todos los documentos subidos, no puede ser premium
      if( user.role === 'user' )
        if( 
          !documentsNames.includes( 'accountStatus' ) ||
          !documentsNames.includes( 'dni' ) ||
          !documentsNames.includes( 'address' ) 
        )
          return res.status(400).send({
            status: 'error',
            message: 'User must have all documents uploaded',
          });

      user.role = user.role == 'premium' ? 'user' : 'premium';
      await user.save();

      res.send({
        status: 'success',
        message: 'User role updated successfully',
      });
    } catch( error ) {
      res.status(400).send({
        status: 'error',
        message: error.message,
      });
    }

  }

  // Responde la información principal de los usuarios
  getAllUsers = async(req, res) => {
    try {
      const users = await userModel.find({},{
        password: 0,
        documents: 0,
        cart: 0,
        resetToken: 0,
        expireToken: 0,
        last_connection: 0
      });

      if( !users )
        return res.status(404).send({
          status: 'error',
          message: 'Users not found',
        });

      res.send({
        status: 'success',
        payload: users,
      });

    } catch(err) {
      res.status(400).send({
        status: 'error',
        message: err.message,
      });
    }
  }

  // Elimina a los usuarios que no se conectaron en el periodo de tiempo especificado
  deleteInactiveUsers = async(req, res) => {
    const deletedUsers = [];
    // Horas permitidas para que un usuario este inactivo
    const allowedInactiveHours = 48;

    // Tiempo de inactividad permitido en milisegundos
    // hr * min * seg * ms
    const allowedInactiveTime = allowedInactiveHours * 60 * 60 * 1000;

    const now = new Date();

    try {
      const userList = await userModel.find({});

      userList.forEach( async(user) => {
        const lastConnection = new Date( user.last_connection );
  
        const inactiveTime = now - lastConnection;
  
        if( inactiveTime > allowedInactiveTime || !user.last_connection ) {
          deletedUsers.push({ email: user.email });
          await userModel.deleteOne({_id: user._id});
          // notifica al usuario que su cuenta fue eliminada por inactividad
          /*
          const mailOptions = {
            from: 'proyecto-node',
            to: user.email,
            subject: 'Cuenta eliminada por inactividad',
            html: '<h1>Le informamos que su usuario ha sido eliminado por inactividad</h1>',
          }
          await transporter.sendMail( mailOptions );
          */
        }
      });

      // Respuesta si no hay usuarios inactivos
      if( deletedUsers.length === 0 )
        return res.send({
          status: 'success',
          message: 'No inactive users found',
        });

      res.send({
        status: 'success',
        message: 'Inactive users deleted successfully',
        payload: deletedUsers,
      });

    } catch(err) {
      res.status(400).send({
        status: 'error',
        message: err.message
      });
    }
  }

  // Elimina un usuario
  deleteUser = async(req, res) => {
    if( !req.authorized )
      return res.status(401).send({
        status: 'error',
        message: 'You are not authorized to perform this action',
      });

    const { uid } = req.params;

    try {
      const user = await userModel.findOne({_id: uid});

      if( !user )
        return res.status(404).send({
          status: 'error',
          message: 'User not found',
        });

      if( user.role === 'admin' )
        return res.status(401).send({
          status: 'error',
          message: 'Admin users cannot be deleted',
        });

      const result = await userModel.deleteOne({_id: uid});

      res.send({
        status: 'success',
        message: 'User deleted successfully',
      })

    } catch(err) {
      res.status(400).send({
        status: 'error',
        message: err.message,
      });
    }
  }
}

export default new UserController();