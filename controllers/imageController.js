import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const uploadImage = async (req, res) => {
  const image = req.files.file;

  if (!image || image.size === 0) {
    return res.status(400)
      .send('No files were uploaded.');
  }

 const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!fileTypes.includes(image.mimetype)) {
    return res.status(400)
      .send('File type not supported.');
  }

  const uploadsDirectory = path.resolve('uploads');

  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }

  const imagePath = path.join(uploadsDirectory, `${req.body.name}.webp`);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath); // Synchronously delete the file
  }

  const uploadPath = path.join(uploadsDirectory, image.name);

  try {
    await image.mv(uploadPath);
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
