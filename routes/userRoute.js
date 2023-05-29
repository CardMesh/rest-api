import express from 'express';
import {
  addClickStatistics,
  deleteUser,
  getAllUsers,
  getClickStatistics,
  getVCardOptions,
  updateUser,
  updateUserSetting,
  updateUserVCardOptions,
  uploadImage,
} from '../controllers/userController.js';
import verifyToken from '../middleware/verify-token.js';
import roles from '../middleware/roles.js';
import checkUserAccess from '../middleware/checkUserAccess.js';

const router = express.Router();

router.get('/', verifyToken, roles('admin'), getAllUsers);
router.get('/:id/statistics/clicks', verifyToken, getClickStatistics);
router.get('/:id/vcard-options', getVCardOptions);
router.post('/:id/statistics/clicks', addClickStatistics);
router.post('/:id/images', verifyToken, checkUserAccess, uploadImage);
router.put('/:id', verifyToken, roles(['admin']), checkUserAccess, updateUser);
router.put('/:id/settings/:setting', verifyToken, checkUserAccess, updateUserSetting);
router.put('/:id/vcard-options', verifyToken, checkUserAccess, updateUserVCardOptions);
router.delete('/:id', verifyToken, roles(['admin']), deleteUser);

export default router;
