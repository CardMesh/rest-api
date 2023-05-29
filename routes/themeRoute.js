import express from 'express';
import {
  getAllThemes,
  getThemeById,
  updateThemeOptionsById,
  uploadImage,
} from '../controllers/themeController.js';

const router = express.Router();

router.get('/', getAllThemes);
router.get('/:id', getThemeById);
router.post('/:id/images', uploadImage);
router.put('/:id', updateThemeOptionsById);

export default router;
