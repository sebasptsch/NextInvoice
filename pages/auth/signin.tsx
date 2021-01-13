import React, { useState } from "react";
import { csrfToken } from "next-auth/client";
import Layout from "../../components/Layout";
import {
  Button,
  FormLabel,
  Input,
  Box,
  Flex,
  Spacer,
  Container,
  useColorMode,
  Heading,
  Divider,
  FormControl,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function SignIn({ csrfToken }) {
  const router = useRouter();
  const { email, error } = router.query;
  const { colorMode, toggleColorMode } = useColorMode();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  // Dev
  const toast = useToast();
  let errorMessage;
  if (error) {
    switch (error) {
      case "Signin":
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
        errorMessage = "Try signing with a different account.";
        break;
      case "OAuthAccountNotLinked":
        errorMessage =
          "To confirm your identity, sign in with the same account you used originally.";
        break;
      case "EmailSignin":
        errorMessage = "Check your email address";
        break;
      case "CredentialsSignin":
        errorMessage =
          "Sign in failed. Check the details you provided are correct.";
        break;
      default:
        errorMessage = "Unable to sign in.";
        break;
    }
  }
  errorMessage ? toast({ description: errorMessage, status: "error" }) : null;
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Box p="1em" w="100%">
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </Box>

      <Container>
        <Heading>Login</Heading>
        <br />

        <Divider />
        <br />

        <form method="post" action="/api/auth/callback/credentials">
          <Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <FormControl mt="4" isInvalid={errorMessage}>
            <FormLabel>Username</FormLabel>
            <Input name="username" type="text" placeholder="Enter username" />
          </FormControl>
          <FormControl mt="4" isInvalid={errorMessage}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                pr="4.5rem"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button mt="4" type="submit">
            Sign in
          </Button>
        </form>
      </Container>
    </>
  );
}

SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await csrfToken(context),
  };
};
