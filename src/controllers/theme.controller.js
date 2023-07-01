import * as themeService from '../services/theme.service.js';

export const getAllThemes = async (req, res) => {
  try {
    const themes = await themeService.getAllThemes();
    res.json({ data: themes });
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

export const uploadImage = async (req, res) => {
  const { image } = req.files;
  const {
    imageHeight,
  } = req.body;

  try {
    await themeService.updateThemeLogoById(req.params.id, image, imageHeight);
    res.json('Success');
  } catch (err) {
    res.status(404)
      .json({ errors: ['Error uploading image.'] });
  }
};
