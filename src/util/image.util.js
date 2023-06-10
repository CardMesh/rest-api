import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const saveImage = async (image, directory, imageName, imageHeight) => {
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

  const webpImagePath = path.join(uploadsDirectory, `${imageName}.webp`);
  const pngImagePath = path.join(uploadsDirectory, `${imageName}.png`);

  if (fs.existsSync(webpImagePath)) {
    fs.unlinkSync(webpImagePath);
  }

  if (fs.existsSync(pngImagePath)) {
    fs.unlinkSync(pngImagePath);
  }

  const uploadPath = path.join(uploadsDirectory, image.name);

  try {
    await image.mv(uploadPath);

    await sharp(uploadPath)
      .resize({ height: +imageHeight })
      .webp()
      .toFile(webpImagePath);

    await sharp(uploadPath)
      .resize({ height: +imageHeight })
      .png()
      .toFile(pngImagePath);

    fs.unlinkSync(uploadPath); // Synchronously delete the file
  } catch (error) {
    throw new Error('Error uploading and converting file.');
  }
};

export default saveImage;
