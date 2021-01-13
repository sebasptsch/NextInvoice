import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import DrawerNavigation from "./Drawer";
import { signIn, signOut, useSession } from "next-auth/client";
import { Router, useRouter } from "next/router";
import Head from "next/head";
import { useRef, useState } from "react";
import { ArrowBackIcon, HamburgerIcon } from "@chakra-ui/icons";
import { NextChakraLink } from "./NextChakraLink";

export default function Layout({ children }: { children: any }) {
  // Hooks
  const [session] = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

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
          <Spinner size="xl" />
        </Center>
      </>
    );
  }

  return (
    <>
      <Box p="1em" w="100%">
        <Flex>
          <IconButton
            aria-label="back"
            icon={<ArrowBackIcon />}
            onClick={() => {
              router.back();
            }}
            disabled={!session}
          />
          <Spacer />
          <IconButton
            aria-label="Menu"
            ref={btnRef}
            onClick={onOpen}
            icon={<HamburgerIcon />}
            variant="outline"
            disabled={!session}
          />
          <DrawerNavigation isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
        </Flex>
      </Box>
      {session ? (
        <Container>{children}</Container>
      ) : (
        <>
          <Center>
            <Button
              onClick={() => {
                router.push(`/api/auth/signin`);
              }}
            >
              Sign In
            </Button>
          </Center>
        </>
      )}
      <br />
      <Box w="100%">
        <Center>Made by Sebastian for Juli</Center>
      </Box>
    </>
  );
}
