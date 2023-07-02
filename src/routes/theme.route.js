import express from 'express';
import {
  createTheme,
  deleteTheme,
  getAllThemes,
  getThemeById,
  updateThemeOptionsById,
  uploadLogo,
} from '../controllers/theme.controller.js';
import roles from '../middlewares/role.middleware.js';
import verifyToken from '../middlewares/verify.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { imageRules, themeOptionsRules } from './validations/theme.validation.js';
import { idRules } from './validations/id.validation.js';

const router = express.Router();

router.get('/', getAllThemes);
router.get('/:id', validate(idRules), getThemeById);
router.post('/', verifyToken, roles(['admin']), createTheme); // todo: validate "name"
router.post('/:id/images', verifyToken, roles(['editor', 'admin']), validate(idRules), validate(imageRules), uploadLogo); // TODO put
router.put('/:id', verifyToken, roles(['editor', 'admin']), validate(idRules), validate(themeOptionsRules), updateThemeOptionsById);
router.delete('/:id', verifyToken, validate(idRules), roles(['editor', 'admin']), deleteTheme);

export default router;
