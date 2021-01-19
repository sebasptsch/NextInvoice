import { ArrowBackIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import { Router, useRouter } from "next/router";
import { useRef, useState } from "react";
import DrawerNavigation from "./Drawer";
import LoadingScreen from "./LoadingScreen.";

export default function Layout({ children }) {
  // Hooks
  const [session, loading] = useSession();
  const router = useRouter();
  const [routerLoading, setRouterLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const toast = useToast();
  // Loading Screen
  Router.events.on("routeChangeStart", () => setRouterLoading(true));
  Router.events.on("routeChangeComplete", () => {
    setRouterLoading(false);
    onClose();
  });
  Router.events.on("routeChangeError", () => setRouterLoading(false));
  if (loading) {
    return <LoadingScreen />;
  }

  if (!session && !loading && router.pathname !== "/auth/signin") {
    router.push("/auth/signin");
    return <></>;
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
          <Center>
            <Heading size={"md"}>Imagination & Creation Art</Heading>
          </Center>

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
      <Container>{children}</Container>
      <br />
      <Box w="100%">
        <Center>Made by Sebastian for Juli</Center>
      </Box>
    </>
  );
}
