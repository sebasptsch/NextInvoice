import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Input,
  Link as ChakraLink,
  Text,
  useColorMode,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import { useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { NextChakraLink } from "./NextChakraLink";

export default function DrawerNavigation() {
  // Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Navigation
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Navigate</DrawerHeader>

            <DrawerBody>
              <Button onClick={toggleColorMode}>
                Toggle {colorMode === "light" ? "Dark" : "Light"}
              </Button>
              <br />
              <br />
              <NextChakraLink href="/">Dashboard</NextChakraLink>
              <br />
              <NextChakraLink href="/invoices">Invoices</NextChakraLink>
              <br />
              <NextChakraLink href="/customers">Customers</NextChakraLink>
              <br />
              <NextChakraLink href="/products">Products</NextChakraLink>
            </DrawerBody>

            <DrawerFooter>
              <NextChakraLink href="https://dashboard.stripe.com">
                Advanced
                <ExternalLinkIcon mx="2px" />
              </NextChakraLink>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
