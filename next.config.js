const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV !== "production",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/invoices",
        permanent: false,
      },
    ];
  },
});
