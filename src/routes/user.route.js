import express from 'express';
import {
  addClickStatistics,
  deleteUser,
  getAllUsers,
  getClickStatistics,
  getVCard,
  getVcf,
  updateUser,
  updateUserSetting,
  updateUserVCard,
  uploadImage,
} from '../controllers/user.controller.js';
import verifyToken from '../middlewares/verify.middleware.js';
import roles from '../middlewares/role.middleware.js';
import checkUserAccess from '../middlewares/access.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { imageRules, vCardRules } from './validations/user.validation.js';
import { idRules } from './validations/id.validation.js';

const router = express.Router();

router.get('/', verifyToken, roles(['admin']), getAllUsers);
router.get('/:id/vcf', validate(idRules), getVcf);
router.get('/:id/statistics/clicks', verifyToken, validate(idRules), getClickStatistics);
router.get('/:id/vcards', validate(idRules), getVCard);
router.post('/:id/statistics/clicks', validate(idRules), addClickStatistics);
router.post('/:id/images', verifyToken, checkUserAccess, validate(idRules), validate(imageRules), uploadImage);
router.put('/:id', verifyToken, roles(['admin']), checkUserAccess, validate(idRules), updateUser);
router.put('/:id/settings/:setting', verifyToken, checkUserAccess, validate(idRules), updateUserSetting);
router.put('/:id/vcards', verifyToken, checkUserAccess, validate(idRules), validate(vCardRules), updateUserVCard);
router.delete('/:id', verifyToken, roles(['admin']), validate(idRules), deleteUser);

export default router;
