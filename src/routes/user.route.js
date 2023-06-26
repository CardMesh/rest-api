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

const router = express.Router();

router.get('/', verifyToken, roles(['admin']), getAllUsers);
router.get('/:id/statistics/clicks', verifyToken, getClickStatistics);
router.get('/:id/vcard-options', getVCard);
router.post('/:id/statistics/clicks', addClickStatistics);
router.post('/:id/images', verifyToken, checkUserAccess, uploadImage);
router.put('/:id', verifyToken, roles(['admin']), checkUserAccess, updateUser);
router.put('/:id/settings/:setting', verifyToken, checkUserAccess, updateUserSetting);
router.put('/:id/vcard-options', verifyToken, checkUserAccess, updateUserVCard);
router.delete('/:id', verifyToken, roles(['admin']), deleteUser);

export default router;
