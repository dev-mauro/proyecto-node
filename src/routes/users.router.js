import { Router } from 'express';

import userController from '../controllers/user.controller.js';
import sessionController from '../controllers/session.controller.js';

import { multerMiddleware, sources } from '../middlewares/multer.middleware.js';
import { adminRoute } from '../middlewares/auth.middleware.js';

const router = Router();

// Recibe el id del usuario
// en el body { documentType: 'dni' | 'address' | 'accountStatus' }
// Recibe campo con un archivo. El nombre del campo debe ser 'document'
router.post('/:uid/documents', multerMiddleware(sources.DOCUMENT), userController.uploadDocuments);

// Cambia un usuario de 'premium' a 'user' y viceversa
// Solo se puede cambiar a usuario premium si el usuario tiene todos los documentos cargados (dni, address y accountStatus)
router.get('/premium/:uid', userController.togglePremium);

// Retorna información principal de los usuarios
router.get('', userController.getAllUsers );

router.delete('', userController.deleteInactiveUsers);

router.delete('/:uid', adminRoute, userController.deleteUser);

export default router;