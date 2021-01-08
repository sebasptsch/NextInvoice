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
import { useRouter } from "next/router";

export default function Layout({
  children,
  noContainer,
}: {
  children: any;
  noContainer?: boolean;
}) {
  const [session, loading] = useSession();
  const router = useRouter();
  if (loading) {
    return (
      <Center h="100vh" w="100%">
        <Spinner />
      </Center>
    );
  }
  if (!session) {
    router.push("/api/auth/signin");
  }

  return (
    <>
      <Box p="1em" w="100%">
        <Flex>
          {session ? (
            <Button
              as="button"
              onClick={() => {
                router.push("/api/auth/signout");
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              as="button"
              onClick={() => {
                router.push("/api/auth/signin");
              }}
            >
              SignIn
            </Button>
          )}
          <Spacer />
          <DrawerNavigation />
        </Flex>
      </Box>
      {session && (noContainer ? children : <Container>{children}</Container>)}
      <Box w="100%">
        <Center>Made by Sebastian for Juli</Center>
      </Box>
    </>
  );
}
