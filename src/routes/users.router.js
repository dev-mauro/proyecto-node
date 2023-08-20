import { Router } from 'express';

import userController from '../controllers/user.controller.js';
import sessionController from '../controllers/session.controller.js';

import {multerMiddleware, sources} from '../middlewares/multer.middleware.js';

const router = Router();

router.get('/premium/:uid', userController.togglePremium);

// Recibe el id del usuario
// en el body { documentType: 'dni' | 'address' | 'accountStatus' }
// Recibe campo con un archivo. El nombre del campo debe ser 'document'
router.post('/:uid/documents', multerMiddleware(sources.DOCUMENT), userController.uploadDocuments);

export default router;