import * as userService from '../services/user.service.js';
import * as themeService from '../services/theme.service.js';
import { generateVCard } from '../utils/vcard.util.js';

export const updateUser = async (req, res) => {
  const options = req.body;
  const { id } = req.params;

  const user = await userService.getUserByIdAndUpdate(id, options);

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  const newUser = {
    name: user.name,
    email: user.email,
    uuid: user.uuid,
    role: user.role,
    themeId: user.themeId,
  };

  return res.json({ data: newUser });
};

export const addClickStatistics = async (req, res) => {
  let { source } = req.body;

  if (!['nfc', 'qr'].includes(source)) {
    source = 'web';
  }

  await userService.updateClickStatistics(req.params.id, source);

  res.json({});
};

export const getClickStatistics = async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  const today = new Date();

  const clickCountsByDate = {};
  const totalClicksByType = {
    qr: 0,
    nfc: 0,
    web: 0,
  };

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - i);
    const dateString = currentDate.toISOString()
      .split('T')[0];

    clickCountsByDate[dateString] = {
      qr: 0,
      nfc: 0,
      web: 0,
    };
  }

  user.clicks.forEach((click) => {
    const {
      source,
      timestamp,
    } = click;
    const clickDate = new Date(timestamp);
    clickDate.setUTCHours(0, 0, 0, 0);
    const dateString = clickDate.toISOString()
      .split('T')[0];

    if (dateString in clickCountsByDate) {
      clickCountsByDate[dateString][source]++;
    }

    totalClicksByType[source]++;
  });

  const totalClicks = user.clicks.length;

  const data = {
    clickCountsByDate,
    totalClicks,
    totalClicksByType,
  };

  return res.json({ data });
};

export const getAllUsers = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const searchQuery = req.query.search || '';

    const {
      users,
      totalUsers,
    } = await userService.getUsersByPageLimitAndSearchQuery(page, limit, searchQuery);

    const totalPages = Math.ceil(totalUsers / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.status(200)
      .json({
        data: users,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages,
          nextPage,
          prevPage,
        },
      });
  } catch (err) {
    res.status(500)
      .json({ errors: ['Error fetching users.'] });
  }
};

export const updateUserSetting = async (req, res) => {
  const { setting } = req.params;
  const { theme } = req.body;

  if (setting !== 'theme') {
    return res.status(400)
      .json({ errors: [`Invalid setting: ${setting}.`] });
  }

  const updateField = { 'settings.theme': theme };

  const user = await userService.getUserByIdAndUpdate(req.params.id, updateField);

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  return res.json({ data: { theme: user.settings.theme } });
};

export const updateUserVCard = async (req, res) => {
  const {
    contact,
    location,
    person,
    professional,
    socialMedia,
  } = req.body;
  const { id: uuid } = req.params;

  const updateField = {
    'vCard.contact': contact,
    'vCard.location': location,
    'vCard.person': person,
    'vCard.professional': professional,
    'vCard.socialMedia': socialMedia,
  };

  const user = await userService.getUserByIdAndUpdate(uuid, updateField, { new: true });

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  const theme = await themeService.getThemeById(user.themeId);

  if (!theme) {
    return res.status(404)
      .json({ errors: ['Theme not found.'] });
  }

  return res.json({ data: { vCardSchema: user.vCard } });
};

export const getVCard = async (req, res) => {
  const uuid = req.params.id;
  const user = await userService.getUserById(uuid);

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  const vCard = {
    ...user.vCard.toObject(),
    uuid,
  };

  return res.json({ data: vCard });
};

export const getVcf = async (req, res) => {
  const uuid = req.params.id;

  const user = await userService.getUserById(uuid);

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  const vCard = user.vCard.toObject();

  const theme = await themeService.getThemeById(user.themeId);

  if (!theme) {
    return res.status(404)
      .json({ errors: ['Theme not found.'] });
  }

  const version = req.query.v;

  const fullName = `${vCard.person.firstName} ${vCard.person.lastName}`;

  res.setHeader('Content-Type', 'text/vcard');
  res.setHeader('Content-Disposition', `attachment; filename="${fullName}"`);

  return res.send(generateVCard(uuid, vCard, theme, version));
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await userService.deleteUserById(id);

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  return res.json({ message: 'User deleted successfully.' });
};

export const uploadImage = async (req, res) => {
  const { image } = req.files;
  const {
    imageHeight,
  } = req.body;
  const { id } = req.params;

  try {
    await userService.uploadAvatarById(id, image, imageHeight);

    const user = await userService.getUserById(id);

    const theme = await themeService.getThemeById(user.themeId);

    if (!theme) {
      return res.status(404)
        .json({ errors: ['Theme not found.'] });
    }

    res.json('Success');
  } catch (err) {
    res.status(404)
      .json({
        errors: ['Error uploading image.'],
      });
  }
};
