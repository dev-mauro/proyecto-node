import { Router } from "express";
import passport from "passport";

import sessionController from '../controllers/session.controller.js'

const router = Router();

router.post('/register', passport.authenticate('register',
  { failureRedirect: '/api/sessions/failregister' }
  ),
  sessionController.successRegister
);

router.get('/failregister', sessionController.failRegister);

router.post('/login', passport.authenticate('login',
  { failureRedirect: '/api/sessions/faillogin' }
  ),
  sessionController.successLogin
);

router.get('/faillogin', sessionController.failLogin);

router.delete('/logout', sessionController.logout);

router.get('/github', passport.authenticate('github', {scope: ['user:email']},
  async(req, res) => {}
));

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),
  sessionController.successGithubLogin
)

router.post('/resetpassword/:token', sessionController.resetPassword);
router.post('/forgotpassword', sessionController.forgotPassword);

export default router;