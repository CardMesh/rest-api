import express from 'express';
import {
  getAllThemes,
  getThemeById,
  updateThemeOptionsById,
  uploadImage,
} from '../controllers/theme.controller.js';
import roles from '../middlewares/role.middleware.js';
import verifyToken from '../middlewares/verify.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { imageRules, themeOptionsRules } from './validations/theme.validation.js';
import { themeIdRules } from './validations/id.validation.js';

const router = express.Router();

router.get('/', getAllThemes);
router.get('/:id', validate(themeIdRules), getThemeById);
router.post('/:id/images', verifyToken, roles(['editor', 'admin']), validate(themeIdRules), validate(imageRules), uploadImage); // TODO put
router.put('/:id', verifyToken, roles(['editor', 'admin']), validate(themeIdRules), validate(themeOptionsRules), updateThemeOptionsById);

export default router;
