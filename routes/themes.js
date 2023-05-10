import { Router } from 'express';
import Theme from '../model/Theme.js';
import verifyToken from '../middleware/verify-token.js';
import roles from '../middleware/roles.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const theme = await Theme.find()
      .exec();
    res.json({ data: theme });
  } catch (err) {
    res.status(500)
      .json({ error: 'Error fetching users' });
  }
});

router.put('/', verifyToken, roles('admin'), async (req, res) => {
  try {
    const options = req.body;

    const theme = await Theme.findOneAndUpdate(
      { },
      options,
      { new: true },
    )
      .exec();

    res.json({ data: { options: theme } });
  } catch (error) {
    res.status(500)
      .json({ error: 'Server error' });
  }
});

export default router;
