import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import DrawerNavigation from "./Drawer";
import { signIn, signOut, useSession } from "next-auth/client";
import { Router, useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";

export default function Layout({ children }: { children: any }) {
  // Hooks
  const [session] = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Loading Screen
  Router.events.on("routeChangeStart", () => setLoading(true));
  Router.events.on("routeChangeComplete", () => setLoading(false));
  Router.events.on("routeChangeError", () => setLoading(false));
  if (loading) {
    return (
      <>
        <Head>
          <title>Loading...</title>
        </Head>
        <Center h="100vh" w="100%">
          <Spinner />
        </Center>
      </>
    );
  }

  return (
    <>
      <Box p="1em" w="100%">
        <Flex>
          {session ? (
            <Button
              as="button"
              onClick={() => {
                router.push("/api/auth/signout", "/api/auth/signout");
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              as="button"
              onClick={() => {
                router.push("/api/auth/signin", "/api/auth/signin");
              }}
            >
              SignIn
            </Button>
          )}
          <Spacer />
          <DrawerNavigation />
        </Flex>
      </Box>
      {session ? <Container>{children}</Container> : null}
      <Box w="100%">
        <Center>Made by Sebastian for Juli</Center>
      </Box>
    </>
  );
}
