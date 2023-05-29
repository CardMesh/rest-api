import * as path from 'path';
import sharp from 'sharp';
import * as fs from 'fs';
import Theme from '../model/Theme.js';
import uploadAndConvertImage from '../util/uploadImage.js';

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

export const getThemeById = async (req, res) => {
  const themeId = req.params.id;

  try {
    const theme = await Theme.findOne({ themeId })
      .exec();
    console.log(theme);
    if (!theme) {
      return res.status(404)
        .json({ error: 'Theme not found' });
    }

    res.json({ data: theme });
  } catch (err) {
    res.status(500)
      .json({ error: 'Error fetching theme by ID' });
  }
};

export const updateThemeOptionsById = async (req, res) => {
  const { id } = req.params;

  try {
    const options = req.body;
    const theme = await Theme.findByIdAndUpdate(id, options, { new: true })
      .exec();

    if (!theme) {
      return res.status(404)
        .json({ error: 'Theme not found' });
    }

    res.json({ data: { options: theme } });
  } catch (error) {
    res.status(500)
      .json({ error: 'Server error' });
  }
};

export const uploadImage = async (req, res) => {
  const image = req.files.file;
  const imageName = req.body.name;
  const themeId = req.params.id;

  await uploadAndConvertImage(image, `uploads/themes/${themeId}`, imageName, 50);

  res.json('Success');
};

export const uploadImage2 = async (req, res) => {
  if (!req.files.file || req.files.file.size === 0) {
    return res.status(400)
      .send('No files were uploaded.');
  }

  const uploadsDirectory = path.resolve('uploads');

  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }

  const imagePath = path.join(uploadsDirectory, `${req.body.name}.webp`);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath); // Synchronously delete the file
  }

  const sampleFile = req.files.file;
  const uploadPath = path.join(uploadsDirectory, sampleFile.name);

  try {
    await sampleFile.mv(uploadPath);
    await sharp(uploadPath)
      .resize({ height: +req.body.height })
      .webp()
      .toFile(imagePath);
    fs.unlinkSync(uploadPath); // Synchronously delete the file
    return res.send('Success!');
  } catch (error) {
    console.error(error);
    return res.status(500)
      .send('Error uploading and converting file to webp.');
  }
};
