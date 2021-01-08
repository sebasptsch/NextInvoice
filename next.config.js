const withPWA = require("next-pwa");

module.exports = withPWA({
  env: {
    NEXTAUTH_USERNAME: process.env.NEXTAUTH_USERNAME,
    NEXTAUTH_PASSWORD: process.env.NEXTAUTH_PASSWORD,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SRIPE_KEY: process.env.SRIPE_KEY,
  },
  pwa: {
    dest: "public",
  },
});
