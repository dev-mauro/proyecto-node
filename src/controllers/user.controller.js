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

}

export default new UserController();