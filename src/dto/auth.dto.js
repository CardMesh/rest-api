export const loginDTO = (user) => ({
  userId: user.userId,
  themeId: user.themeId,
  name: user.name,
  email: user.email,
  role: user.role,
  token: user.token,
});
