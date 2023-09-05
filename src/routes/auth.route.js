import { Router } from 'express';
import {
  login, recover, reset, signup,
} from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import roles from '../middlewares/role.middleware.js';
import verifyToken from '../middlewares/verify.middleware.js';
import {
  loginRules, recoverRules, resetRules, signupRules,
} from './validations/auth.validation.js';

const router = Router();

router.post('/signup', verifyToken, roles(['admin']), validate(signupRules), signup);
router.post('/login', validate(loginRules), login);
router.post('/recover', verifyToken, roles(['admin']), validate(recoverRules), recover);
router.put('/reset', validate(resetRules), reset);

export default router;
