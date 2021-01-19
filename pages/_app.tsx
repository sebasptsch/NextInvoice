import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";
import { Provider } from "next-auth/client";
import "../styles/globals.css";

axios.defaults.baseURL = process.env.NEXTAUTH_URL;

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
