import express from 'express';
import {
  getAllThemes,
  getThemeById,
  updateThemeOptionsById,
  uploadImage,
} from '../controllers/theme.controller.js';
import roles from '../middlewares/role.middleware.js';
import verifyToken from '../middlewares/verify.middleware.js';

const router = express.Router();

router.get('/', getAllThemes);
router.get('/:id', getThemeById);
router.post('/:id/images', verifyToken, roles(['editor', 'admin']), uploadImage);
router.put('/:id', verifyToken, roles(['editor', 'admin']), updateThemeOptionsById);

export default router;
