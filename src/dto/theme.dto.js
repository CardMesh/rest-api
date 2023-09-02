export const themeDTO = (theme) => ({
  color: {
    font: {
      primary: theme.color.font.primary,
      secondary: theme.color.font.secondary,
    },
    contactIcons: {
      font: theme.color.contactIcons.font,
      background: theme.color.contactIcons.background,
    },
    socialIcons: {
      font: theme.color.socialIcons.font,
      background: theme.color.socialIcons.background,
    },
    vCardBtn: {
      font: theme.color.vCardBtn.font,
      background: theme.color.vCardBtn.background,
    },
    background: theme.color.background,
  },
  name: theme.name,
  display: {
    logo: theme.display.logo,
    phone: theme.display.phone,
    sms: theme.display.sms,
    email: theme.display.email,
    web: theme.display.web,
    address: theme.display.address,
    map: theme.display.map,
    vCardBtn: theme.display.vCardBtn,
  },
  align: {
    logo: theme.align.logo,
    avatar: theme.align.avatar,
    heading: theme.align.heading,
    bio: theme.align.bio,
    socialIcons: theme.align.socialIcons,
  },
  logo: {
    size: {
      height: theme.logo.size.height,
    },
    format: {
      png: theme.logo.format.png,
      webp: theme.logo.format.webp,
    },
  },
  themeId: theme.themeId,
});

export const themesByPageLimitAndSearchQueryDTO = (
  themes,
  page,
  totalThemes,
  totalPages,
  nextPage,
  prevPage,
) => ({
  themes: themes.map((theme) => ({
    name: theme.name,
    themeId: theme.themeId,
  })),
  totalThemes,
  page,
  totalPages,
  nextPage,
  prevPage,
});
