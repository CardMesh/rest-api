import * as path from 'path';
import sharp from 'sharp';
import * as fs from 'fs';
import Theme from '../model/Theme.js';

export const getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find()
      .exec();
    res.json({ data: themes });
  } catch (err) {
    res.status(500)
      .json({ error: 'Error fetching themes' });
  }
};

export const updateThemeOptions = async (req, res) => {
  try {
    const options = req.body;
    const theme = await Theme.findOneAndUpdate({}, options, { new: true })
      .exec();
    res.json({ data: { options: theme } });
  } catch (error) {
    res.status(500)
      .json({ error: 'Server error' });
  }
};

export const uploadImage = async (req, res) => {
  if (!req.files.file || req.files.file.size === 0) {
    return res.status(400)
      .send('No files were uploaded.');
  }

  const uploadsDirectory = path.resolve('uploads');
  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }

  const webpPath = path.join(uploadsDirectory, `${req.body.name}.webp`);

  if (fs.existsSync(webpPath)) {
    fs.unlinkSync(webpPath); // Synchronously delete the file
  }

  const sampleFile = req.files.file;
  const uploadPath = path.join(uploadsDirectory, sampleFile.name);

  try {
    await sampleFile.mv(uploadPath);
    await sharp(uploadPath)
      .resize({ height: +req.body.height })
      .webp()
      .toFile(webpPath);
    fs.unlinkSync(uploadPath); // Synchronously delete the file
    return res.send('Success!');
  } catch (error) {
    console.error(error);
    return res.status(500)
      .send('Error uploading and converting file to webp.');
  }
};
