import { Router } from 'express';
import * as path from 'path';
import sharp from 'sharp';
import * as fs from 'fs';
import roles from '../middleware/roles.js';
import verifyToken from '../middleware/verify-token.js';
import Theme from '../model/Theme.js';

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
      {},
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

// TODO move endpoint
router.post('/upload', async (req, res) => {
  if (!req.files.logo || Object.keys(req.files.logo).length === 0) {
    return res.status(400)
      .send('No files were uploaded.');
  }
  const webpPath = `${path.resolve()}/uploads/${req.body.name}.webp`;

  fs.unlink(webpPath, (err) => {
    if (err) {
      return res.status(500)
        .send('Error.');
    }
  });

  const sampleFile = req.files.logo;
  const uploadPath = `${path.resolve()}/uploads/${sampleFile.name}`;

  sampleFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500)
        .send(err);
    }

    sharp(uploadPath)
      .resize({ height: +req.body.height })
      .webp()
      .toFile(webpPath)
      .then(() => {
        fs.unlink(uploadPath, (err) => {
          if (err) {
            res.status(500)
              .send('Error.');
          } else {
            res.send('Success!');
          }
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500)
          .send('Error converting and resizing file to webp.');
      });
  });
});

export default router;
