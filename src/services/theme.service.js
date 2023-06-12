import Theme from '../models/theme.model.js';
import uploadAndConvertImage from '../utils/image.util.js';

export const getAllThemes = async () => Theme.find()
  .exec();

export const getThemeById = async (id) => Theme.findOne({ id })
  .exec();

export const updateThemeOptionsById = async (id, options) => Theme.findOneAndUpdate({ id }, options, { new: true })
  .exec();

export const uploadThemeImage = async (id, image, imageName, imageHeight) => {
  await uploadAndConvertImage(image, `uploads/themes/${id}`, imageName, imageHeight);
};
