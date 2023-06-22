import { Router } from "express";

import chatController from '../controllers/chat.controller.js'

const router = Router();

router.get('/', chatController.getChatLog);

router.post('/', chatController.postMessage);

export default router;