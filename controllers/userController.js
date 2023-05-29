import saveVCard from '../util/vcard.js';
import User from '../model/User.js';

export const updateUser = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params.id;

  const user = await User.findOneAndUpdate(
    { uuid: id },
    { name },
    { new: true },
  )
    .exec();

  if (!user) {
    return res.status(404)
      .json({ message: 'User not found' });
  }

  res.json({ data: { name: user.name } });
};

export const addClickStatistics = async (req, res) => {
  let { source } = req.body;

  if (!['nfc', 'qr'].includes(source)) {
    source = 'web';
  }

  await User.updateOne(
    { uuid: req.params.id },
    { $push: { clicks: { source } } },
  );

  res.json({});
};

export const getClickStatistics = async (req, res) => {
  const user = await User.findOne({ uuid: req.params.id })
    .exec();

  if (!user) {
    return res.status(404)
      .json({ message: 'User not found' });
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

  res.json({ data });
};

export const getAllUsers = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const searchQuery = req.query.search || '';

    const skipDocs = (page - 1) * limit;

    const searchPattern = new RegExp(searchQuery, 'i');

    const query = User.find()
      .select('email name role uuid')
      .skip(skipDocs)
      .limit(limit);

    if (searchQuery) {
      query.or([
        { email: searchPattern },
        { name: searchPattern },
        { role: searchPattern },
        { uuid: searchPattern },
      ]);
    }

    const users = await query;

    const totalUsers = await User.countDocuments({
      $or: [
        { email: searchPattern },
        { name: searchPattern },
        { role: searchPattern },
        { uuid: searchPattern },
      ],
    });

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
    console.error('Error fetching users:', err);
    res.status(500)
      .json({ error: 'Error fetching users' });
  }
};

export const updateUserSetting = async (req, res) => {
  const { setting } = req.params;
  const { theme } = req.body;

  if (setting !== 'theme') {
    return res.status(400)
      .json({ error: `Invalid setting: ${setting}` });
  }

  const updateField = { 'settings.theme': theme };

  const user = await User.findOneAndUpdate(
    { uuid: req.params.id },
    updateField,
    { new: true },
  )
    .exec();

  if (!user) {
    return res.status(404)
      .json({ error: 'User not found' });
  }

  res.json({ data: { theme: user.settings.theme } });
};

export const updateUserVCardOptions = async (req, res) => {
  const vCardOptions = req.body;
  const uuid = req.params.id;

  const user = await User.findOneAndUpdate(
    { uuid },
    { vCardOptions },
    { new: true },
  )
    .exec();

  if (!user) {
    return res.status(404)
      .json({ message: 'User not found' });
  }

  await saveVCard(vCardOptions, uuid, 3);
  await saveVCard(vCardOptions, uuid, 4);

  res.json({ data: { vCardOptionsSchema: user.vCardOptions } });
};

export const getVCardOptions = async (req, res) => {
  const uuid = req.params.id;

  const user = await User.findOne({ uuid })
    .exec();

  if (!user) {
    return res.status(404)
      .json({ message: 'User not found' });
  }

  const vCardOptions = {
    ...user.vCardOptions.toObject(),
    uuid,
  };

  res.json({ data: vCardOptions });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOneAndDelete({ uuid: id })
    .exec();

  if (!user) {
    return res.status(404)
      .json({ message: 'User not found' });
  }

  res.json({ data: { message: 'User deleted successfully' } });
};
