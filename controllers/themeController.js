import Theme from '../model/Theme.js';
import uploadAndConvertImage from '../util/uploadImage.js';

export const getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find()
      .exec();
    res.json({ data: themes });
  } catch (err) {
    res.status(500)
      .json({ error: 'Error fetching themes' });
  }
};

export const getThemeById = async (req, res) => {
  const themeId = req.params.id;

  try {
    const theme = await Theme.findOne({ themeId })
      .exec();

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
  const { id } = req.params;

  try {
    const options = req.body;
    const theme = await Theme.findOneAndUpdate({ id }, options, { new: true })
      .exec();

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
  const { id } = req.params;

  await uploadAndConvertImage(image, `uploads/themes/${id}`, imageName, imageHeight);

  res.json('Success');
};
