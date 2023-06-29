import express from 'express';
import {
  addClickStatistics,
  deleteUser,
  getAllUsers,
  getClickStatistics,
  getVCard,
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
import { userIdRules } from './validations/id.validation.js';

const router = express.Router();

router.get('/', verifyToken, roles(['admin']), getAllUsers);
router.get('/:id/statistics/clicks', verifyToken, validate(userIdRules), getClickStatistics);
router.get('/:id/vcard-options', validate(userIdRules), getVCard);
router.post('/:id/statistics/clicks', validate(userIdRules), addClickStatistics);
router.post('/:id/images', verifyToken, checkUserAccess, validate(userIdRules), validate(imageRules), uploadImage);
router.put('/:id', verifyToken, roles(['admin']), checkUserAccess, validate(userIdRules), updateUser); // TODO not yet in use
router.put('/:id/settings/:setting', verifyToken, checkUserAccess, validate(userIdRules), updateUserSetting); // TODO not yet in use
router.put('/:id/vcard-options', verifyToken, checkUserAccess, validate(vCardRules), validate(userIdRules), updateUserVCard);
router.delete('/:id', verifyToken, roles(['admin']), validate(userIdRules), deleteUser);

export default router;
