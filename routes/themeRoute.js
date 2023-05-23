import express from 'express';
import { getAllThemes, updateThemeOptions, uploadImage } from '../controllers/themeController.js';

const router = express.Router();

router.get('/', getAllThemes);
router.post('/upload', uploadImage);
router.put('/', updateThemeOptions);

export default router;
