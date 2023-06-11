import * as themeService from '../services/theme.service.js';

export const getAllThemes = async (req, res) => {
  try {
    const themes = await themeService.getAllThemes();
    res.json({ data: themes });
  } catch (err) {
    res.status(500)
      .json({ error: 'Error fetching themes' });
  }
};

export const getThemeById = async (req, res) => {
  try {
    const theme = await themeService.getThemeById(req.params.id);

    if (!theme) {
      return res.status(404)
        .json({ error: 'Theme not found' });
    }

    res.json({ data: theme });
  } catch (err) {
    res.status(500)
      .json({ error: 'Error fetching theme by ID' });
  }
};

export const updateThemeOptionsById = async (req, res) => {
  try {
    const theme = await themeService.updateThemeOptionsById(req.params.id, req.body);

    if (!theme) {
      return res.status(404)
        .json({ error: 'Theme not found' });
    }

    res.json({ data: { options: theme } });
  } catch (error) {
    res.status(500)
      .json({ error: 'Server error' });
  }
};

export const uploadImage = async (req, res) => {
  const { image } = req.files;
  const {
    imageName,
    imageHeight,
  } = req.body;

  try {
    await themeService.uploadThemeImage(req.params.id, image, imageName, imageHeight);
    res.json('Success');
  } catch (error) {
    res.status(404)
      .json({ errors: ['Error'] });
  }
};
