import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";

const options: InitOptions = {
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",

    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: null, // If set, new users will be directed here on first sign in
  },
  providers: [
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        if (
          credentials.username === process.env.NEXTAUTH_USERNAME &&
          credentials.password === process.env.NEXTAUTH_PASSWORD
        ) {
          const user = { id: 1, name: "Admin" };
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
};

export default (req, res) => NextAuth(req, res, options);
