import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";
import { Provider } from "next-auth/client";
import Layout from "../components/Layout";
import "../styles/globals.css";

axios.defaults.baseURL = process.env.NEXTAUTH_URL;

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
