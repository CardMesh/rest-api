import { Router } from 'express';
import saveVCard from '../util/vcard.js';
import User from '../model/User.js';
import validate from '../middleware/validate.js';
import { userRules } from './validations/users.js';
import roles from '../middleware/roles.js';
import verifyToken from '../middleware/verify-token.js';
import checkUserAccess from '../middleware/checkUserAccess.js';

const router = Router();

// TODO make it possible to edit the whole admin object
router.put('/:id', verifyToken, roles(['admin']), checkUserAccess, validate(userRules), async (req, res) => {
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
});

router.post('/:id/statistics/clicks', async (req, res) => {
  let { source } = req.body;

  if (!['nfc', 'qr'].includes(source)) {
    source = 'web';
  }

  await User.updateOne(
    { uuid: req.params.id },
    { $push: { clicks: { source } } },
  );

  res.sendStatus(200);
});

router.get('/:id/statistics/clicks', async (req, res) => {
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
});

router.get('/:id/statistics/clicks', verifyToken, checkUserAccess, async (req, res) => {
  const user = await User.findOne({ uuid: req.params.id })
    .exec();

  if (!user) {
    return res.status(404)
      .json({ message: 'User not found' });
  }

  const { source } = user.statistics;

  res.json({ data: { source } });
});

router.get('/', verifyToken, roles('admin'), async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const searchQuery = req.query.search || '';

    // Calculate the number of documents to skip
    const skipDocs = (page - 1) * limit;

    // Create a regex pattern to perform case-insensitive search
    const searchPattern = new RegExp(searchQuery, 'i');

    // Find users with pagination and search
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

    // Get the total count of documents matching the search query
    const totalUsers = await User.countDocuments({
      $or: [
        { email: searchPattern },
        { name: searchPattern },
        { role: searchPattern },
        { uuid: searchPattern },
      ],
    });

    // Prepare pagination metadata
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
});

router.put('/:id/settings/:setting', verifyToken, checkUserAccess, async (req, res) => {
  const { setting } = req.params;
  let updateField = null;
  let responseData = {};

  switch (setting) {
    case 'language':
      updateField = { 'settings.language': req.body.language };
      responseData = { language: req.body.language };
      break;
    case 'theme':
      updateField = { 'settings.theme': req.body.theme };
      responseData = { theme: req.body.theme };
      break;
    default:
      return res.status(400)
        .json({ error: `Invalid setting: ${setting}` });
  }

  const user = await User.findOneAndUpdate({ uuid: req.params.id }, updateField, { new: true })
    .exec();

  if (!user) {
    return res.status(404)
      .json({ error: 'User not found' });
  }

  res.json({ data: responseData });
});

router.put('/:id/vcard-options', verifyToken, checkUserAccess, async (req, res) => {
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

  await saveVCard(vCardOptions, uuid, '3');
  await saveVCard(vCardOptions, uuid, '4');

  res.json({ data: { vCardOptionsSchema: user.vCardOptions } });
});

router.get('/:id/vcard-options', async (req, res) => {
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
});

router.delete('/:id', verifyToken, roles(['admin']), async (req, res) => {
  const { id } = req.params;

  const user = await User.findOneAndDelete({ uuid: id })
    .exec();

  if (!user) {
    return res.status(404)
      .json({ message: 'User not found' });
  }

  res.json({ data: { message: 'User deleted successfully' } });
});

export default router;
