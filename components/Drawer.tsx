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
import Link from "next/link";
import { useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { ExternalLinkIcon } from "@chakra-ui/icons";

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
              <Link
                passHref
                href="/invoices"
                children={<ChakraLink>Invoices</ChakraLink>}
              />
              <br />
              <Link
                passHref
                href="/customers"
                children={<ChakraLink>Customers</ChakraLink>}
              />
              <br />
              <Link
                passHref
                href="/products"
                children={<ChakraLink>Products</ChakraLink>}
              />
            </DrawerBody>

            <DrawerFooter>
              <Link
                passHref
                href="https://dashboard.stripe.com"
                children={
                  <ChakraLink isExternal>
                    Products
                    <ExternalLinkIcon mx="2px" />
                  </ChakraLink>
                }
              />
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
