import sharp from 'sharp';

const saveImage = async (image, height) => {
  if (!image || image.size === 0) {
    throw new Error('No files were uploaded.');
  }

  const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!fileTypes.includes(image.mimetype)) {
    throw new Error('File type not supported.');
  }

  try {
    const imageResizer = sharp(image.data);

    const metadata = await imageResizer.metadata();
    const aspectRatio = metadata.width / metadata.height;
    const width = Math.round(height * aspectRatio);

    const resizeOptions = {
      width,
      height,
    };

    const webpImageBufferPromise = imageResizer.resize(resizeOptions)
      .webp()
      .toBuffer();
    const pngImageBufferPromise = imageResizer.resize(resizeOptions)
      .png()
      .toBuffer();

    const [webpImageBuffer, pngImageBuffer] = await Promise.all([
      webpImageBufferPromise,
      pngImageBufferPromise,
    ]);

    const webpBase64 = webpImageBuffer.toString('base64');
    const pngBase64 = pngImageBuffer.toString('base64');

    return {
      size: {
        height,
        width,
      },
      format: {
        png: pngBase64,
        webp: webpBase64,
      },
    };
  } catch (err) {
    throw new Error('Error uploading and converting file.');
  }
};

export default saveImage;
