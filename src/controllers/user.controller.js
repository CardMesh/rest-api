import * as userService from '../services/user.service.js';

export const updateUser = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params.id;

  const user = await userService.getUserByIdAndUpdate(id, { name });

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  return res.json({ data: { name: user.name } });
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
    } = await userService.getUserByPageLimitAndSearchQuery(page, limit, searchQuery);

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

export const updateUserVCardOptions = async (req, res) => {
  const vCardOptions = req.body;
  const uuid = req.params.id;

  const user = await userService.getUserByIdAndUpdate(
    uuid,
    { vCardOptions },
  );

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  await userService.saveUserVCard(vCardOptions, uuid);

  return res.json({ data: { vCardOptionsSchema: user.vCardOptions } });
};

export const getVCardOptions = async (req, res) => {
  const uuid = req.params.id;

  const user = await userService.getUserById(uuid);

  if (!user) {
    return res.status(404)
      .json({ errors: ['User not found.'] });
  }

  const vCardOptions = {
    ...user.vCardOptions.toObject(),
    uuid,
  };

  return res.json({ data: vCardOptions });
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
    imageName,
    imageHeight,
  } = req.body;
  const { id } = req.params;

  try {
    await userService.uploadUserImage(image, id, imageName, imageHeight);

    const user = await userService.getUserById(id);

    await userService.saveUserVCard(user.vCardOptions, id);

    res.json('Success');
  } catch (err) {
    res.status(404)
      .json({
        errors: ['Error uploading image.'],
      });
  }
};
