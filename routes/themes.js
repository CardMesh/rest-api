import { Router } from 'express';
import Theme from '../model/Theme.js';

const router = Router();

router.get('/', async (req, res) => {
  const themes = await Theme.find().exec();

  const data = themes.map((theme) => ({
    color: theme.color,
  }));

  res.json({
    data,
  });
});

export default router;
