import User from '../models/user.model.js';
import saveVCard from '../utils/vcard.util.js';
import convertImage from '../utils/image.util.js';

export const getUserByIdAndUpdate = async (id, update) => User.findOneAndUpdate(
  { uuid: { $eq: id } },
  update,
  { new: true },
)
  .exec();

export const getUserById = async (id) => User.findOne({ uuid: { $eq: id } })
  .exec();

export const updateClickStatistics = async (id, source) => User.updateOne(
  { uuid: { $eq: id } },
  { $push: { clicks: { source } } },
);

export const getUserByPageLimitAndSearchQuery = async (page, limit, searchQuery) => {
  const skipDocs = (page - 1) * limit;
  const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const searchPattern = new RegExp(escapedSearchQuery, 'i');
  const query = User.find()
    .select('email name role uuid')
    .skip(skipDocs)
    .limit(limit);
  const searchQueries = [
    { email: searchPattern },
    { name: searchPattern },
    { role: searchPattern },
  ];
  if (searchQuery) {
    query.or(searchQueries);
  }
  const users = await query;
  const totalUsers = await User.countDocuments({
    $or: searchQueries,
  });
  return {
    users,
    totalUsers,
  };
};

export const deleteUserById = async (id) => User.findOneAndDelete({ uuid: { $eq: id } })
  .exec();

export const uploadAvatarById = async (id, image, imageHeight) => {
  try {
    const {
      size,
      format,
    } = await convertImage(image, +imageHeight);

    const avatar = {
      'vCard.avatar.size': size,
      'vCard.avatar.format': format,
    };

    return await User.findOneAndUpdate({ uuid: id }, avatar, { new: true })
      .exec();
  } catch (err) {
    throw new Error('Error uploading avatar.');
  }
};

export const saveUserVCard = async (uuid, vCard, theme) => {
  await saveVCard(uuid, vCard, theme, 3); // todo use map map?
  await saveVCard(uuid, vCard, theme, 4);
};
