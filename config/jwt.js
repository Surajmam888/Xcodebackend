export const jwtConfig = {
  accessSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  emailSecret: process.env.JWT_EMAIL_SECRET,
};
