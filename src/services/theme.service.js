import sanitize from 'mongo-sanitize';
import Theme from '../models/theme.model.js';
import convertImage from '../utils/image.util.js';
import { themeDTO, themesByPageLimitAndSearchQueryDTO } from '../dto/theme.dto.js';

export const getThemesByPageLimitAndSearchQuery = async (page, limit, searchQuery) => {
  const skipDocs = (page - 1) * limit;
  const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const searchPattern = new RegExp(escapedSearchQuery, 'i');
  const query = Theme.find({ name: searchPattern })
    .select('name themeId')
    .skip(skipDocs)
    .limit(limit);

  const [themes, totalThemes] = await Promise.all([
    query.exec(),
    Theme.countDocuments({ name: searchPattern }),
  ]);

  const totalPages = Math.ceil(totalThemes / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return themesByPageLimitAndSearchQueryDTO(
    themes,
    page,
    totalThemes,
    totalPages,
    nextPage,
    prevPage,
  );
};

export const getThemeById = async (id) => {
  const theme = await Theme.findOne({ themeId: id })
    .exec();

  if (!theme) {
    throw new Error('Theme not found.');
  }

  return themeDTO(theme);
};

export const createTheme = async (options) => {
  const sanitizedOptions = sanitize(options);

  const theme = await Theme.create({
    name: sanitizedOptions.name,
    color: {},
    align: {},
    display: {},
    logo: {
      size: {},
      format: {},
    },
  });

  return themeDTO(theme);
};

export const updateThemeOptionsById = async (id, options) => {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid options provided.');
  }

  const sanitizedOptions = sanitize(options);

  const {
    logo,
    ...updatedOptions
  } = sanitizedOptions;

  if (logo && logo.size && logo.size.height) {
    logo.size.height = +logo.size.height;
  }

  const updateQuery = {
    ...updatedOptions,
    'logo.size': logo.size,
  };

  const updatedTheme = await Theme.findOneAndUpdate(
    { themeId: id },
    updateQuery,
    { new: true },
  ).exec();

  if (!updatedTheme) {
    throw new Error('Theme not found.');
  }

  return themeDTO(updatedTheme);
};

export const updateThemeLogoById = async (id, image, imageHeight) => {
  try {
    const { format } = await convertImage(image, +imageHeight);
    const sanitizedFormat = sanitize(format);

    const updatedTheme = await Theme.findOneAndUpdate(
      { themeId: id },
      { 'logo.format': sanitizedFormat },
      { new: true },
    )
      .exec();

    if (!updatedTheme) {
      throw new Error('Theme not found.');
    }

    return themeDTO(updatedTheme);
  } catch (err) {
    throw new Error('Error uploading theme image.');
  }
};

export const deleteThemeById = async (id) => {
  const deletedTheme = await Theme.findOneAndDelete({ themeId: id })
    .exec();

  if (!deletedTheme) {
    throw new Error('Theme not found.');
  }
};
