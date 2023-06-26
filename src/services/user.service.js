import User from '../models/user.model.js';
import saveVCard from '../utils/vcard.util.js';
import uploadAndConvertImage from '../utils/image.util.js';

export const getUserByIdAndUpdate = async (id, update) => User.findOneAndUpdate(
  { uuid: id },
  update,
  { new: true },
)
  .exec();

export const getUserById = async (id) => User.findOne({ uuid: id })
  .exec();

export const updateClickStatistics = async (id, source) => User.updateOne(
  { uuid: id },
  { $push: { clicks: { source } } },
);

export const getUserByPageLimitAndSearchQuery = async (page, limit, searchQuery) => {
  const skipDocs = (page - 1) * limit;
  const searchPattern = new RegExp(searchQuery, 'i');
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

export const deleteUserById = async (id) => User.findOneAndDelete({ uuid: id })
  .exec();

export const uploadUserImage = async (image, id, imageName, imageHeight) => {
  await uploadAndConvertImage(image, `uploads/users/${id}`, imageName, imageHeight);
};

export const saveUserVCard = async (vCardOptions, uuid) => {
  await saveVCard(vCardOptions, uuid, 3);
  await saveVCard(vCardOptions, uuid, 4);
};
