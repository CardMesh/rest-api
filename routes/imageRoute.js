import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import { uploadImage } from '../controllers/imageController.js';

const router = express.Router();

router.post('/', verifyToken, uploadImage);

export default router;
