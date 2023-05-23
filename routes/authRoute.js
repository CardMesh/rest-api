import { Router } from 'express';
import {
  login, recover, reset, signup,
} from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import roles from '../middleware/roles.js';
import verifyToken from '../middleware/verify-token.js';
import {
  loginRules, recoverRules, resetRules, signupRules,
} from './validations/authValidation.js';

const router = Router();

router.post('/signup', verifyToken, roles(['admin']), validate(signupRules), signup);
router.post('/login', validate(loginRules), login);
router.post('/recover', verifyToken, roles(['admin']), validate(recoverRules), recover);
router.put('/reset', validate(resetRules), reset);

export default router;
