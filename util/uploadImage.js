import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadAndConvertImage = async (image, directory = 'uploads', imageName, imageHeight) => {
  if (!image || image.size === 0) {
    throw new Error('No files were uploaded.');
  }

  const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!fileTypes.includes(image.mimetype)) {
    throw new Error('File type not supported.');
  }

  const uploadsDirectory = path.resolve(directory);

  if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }

  const imagePath = path.join(uploadsDirectory, `${imageName}.webp`);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath); // Synchronously delete the file
  }

  const uploadPath = path.join(uploadsDirectory, image.name);

  try {
    await image.mv(uploadPath);
    await sharp(uploadPath)
      .resize({ height: imageHeight })
      .webp()
      .toFile(imagePath);
    fs.unlinkSync(uploadPath); // Synchronously delete the file
  } catch (error) {
    console.error(error);
    throw new Error('Error uploading and converting file to webp.');
  }
};

export default uploadAndConvertImage;
