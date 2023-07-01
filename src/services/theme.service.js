import sanitize from 'mongo-sanitize';
import Theme from '../models/theme.model.js';
import convertImage from '../utils/image.util.js';

export const getAllThemes = () => Theme.find()
  .exec();

export const getThemeById = async (id) => {
  const theme = await Theme.findOne({ uuid: id })
    .exec();
  if (!theme) {
    throw new Error('Theme not found.');
  }
  return theme;
};

export const updateThemeOptionsById = async (id, options) => {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid options provided.');
  }

  const {
    logo,
    ...updatedOptions
  } = options;

  const sanitizedLogo = sanitize(logo);
  const sanitizedOptions = sanitize(updatedOptions);

  const update = { ...sanitizedOptions };
  if (sanitizedLogo) {
    update['logo.size'] = sanitizedLogo.size;
  }

  const updatedTheme = await Theme.findOneAndUpdate({ uuid: id }, update, { new: true })
    .exec();
  if (!updatedTheme) {
    throw new Error('Theme not found.');
  }

  return updatedTheme;
};

export const updateThemeLogoById = async (id, image, imageHeight) => {
  try {
    const { format } = await convertImage(image, +imageHeight);

    const sanitizedFormat = sanitize(format);

    const update = {
      'logo.format': sanitizedFormat,
    };

    const sanitizedId = sanitize(id);
    const updatedTheme = await Theme.findOneAndUpdate({ uuid: sanitizedId }, update, { new: true })
      .exec();
    if (!updatedTheme) {
      throw new Error('Theme not found.');
    }

    return updatedTheme;
  } catch (err) {
    throw new Error('Error uploading theme image.');
  }
};
