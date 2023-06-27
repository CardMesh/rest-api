import Theme from '../models/theme.model.js';
import uploadAndConvertImage from '../utils/image.util.js';

export const getAllThemes = async () => Theme.find()
  .exec();

export const getThemeById = async (id) => {
  const theme = await Theme.findOne({ uuid: id }).exec();

  if (!theme) {
    throw new Error('Theme not found.');
  }

  return theme;
};

export const updateThemeOptionsById = async (id, options) => {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid options provided.');
  }

  const updatedTheme = await Theme.findOneAndUpdate({ uuid: id }, options, { new: true }).exec();

  if (!updatedTheme) {
    throw new Error('Theme not found.');
  }

  return updatedTheme;
};

export const uploadThemeImage = async (id, image, imageName, imageHeight) => {
  await uploadAndConvertImage(image, `uploads/themes/${id}`, imageName, imageHeight);
};
