import * as themeService from '../services/theme.service.js';
import * as userService from '../services/user.service.js';

export const getAllThemes = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const searchQuery = req.query.search || '';

    const {
      themes,
      totalThemes,
      totalPages,
      nextPage,
      prevPage,
    } = await themeService.getThemesByPageLimitAndSearchQuery(page, limit, searchQuery);

    res.json({
      data: themes,
      pagination: {
        page,
        limit,
        totalThemes,
        totalPages,
        nextPage,
        prevPage,
      },
    });
  } catch (err) {
    res.status(500)
      .json({ errors: ['Error fetching themes.'] });
  }
};

export const getThemeById = async (req, res) => {
  try {
    const theme = await themeService.getThemeById(req.params.id);

    if (!theme) {
      return res.status(404)
        .json({ errors: ['Theme not found.'] });
    }

    return res.json({ data: theme });
  } catch (err) {
    return res.status(500)
      .json({ errors: ['Error fetching theme.'] });
  }
};

export const createTheme = async (req, res) => {
  try {
    const theme = await themeService.createTheme(req.body);

    return res.status(201)
      .json({ data: theme });
  } catch (err) {
    return res.status(500)
      .json({ errors: ['Error creating theme.'] });
  }
};

export const updateThemeOptionsById = async (req, res) => {
  try {
    const theme = await themeService.updateThemeOptionsById(req.params.id, req.body);

    if (!theme) {
      return res.status(404)
        .json({ errors: ['Theme not found.'] });
    }

    return res.json({ data: { options: theme } });
  } catch (err) {
    return res.status(500)
      .json({ errors: ['Error updating theme options.'] });
  }
};

export const uploadLogo = async (req, res) => {
  const { image } = req.files;
  const { imageHeight } = req.body;

  try {
    await themeService.updateThemeLogoById(req.params.id, image, imageHeight);
    res.json('Success');
  } catch (err) {
    res.status(500)
      .json({ errors: ['Error uploading image.'] });
  }
};

export const deleteTheme = async (req, res) => {
  const { id } = req.params;

  // Check if any users are using the theme.
  const usersWithTheme = await userService.getUsersByThemeId(id);

  if (usersWithTheme.length > 0) {
    return res.status(400)
      .json({
        errors: ['Cannot delete the theme. It is currently in use by one or more users.'],
      });
  }

  // Delete the theme if it is not used by any users.
  const deletedTheme = await themeService.deleteThemeById(id);

  if (!deletedTheme) {
    return res.status(404)
      .json({ errors: ['Theme not found.'] });
  }

  return res.json({ message: 'Theme deleted successfully.' });
};
