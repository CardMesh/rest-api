export const userDTO = (user) => ({
  name: user.name,
  email: user.email,
  userId: user.userId,
  role: user.role,
  themeId: user.themeId,
});

export const usersDTO = (users) => users.map((user) => userDTO(user));

export const usersByPageLimitAndSearchQueryDTO = (users, totalUsers, totalPages, nextPage, prevPage) => ({
  users: users.map((user) => userDTO(user)),
  totalUsers,
  totalPages,
  nextPage,
  prevPage,
});
