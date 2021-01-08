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
import Link from 'next/link';
import { useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/client";

export default function DrawerNavigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [session, loading] = useSession();
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
              <Link passHref href="/invoices" children={<ChakraLink>Invoices</ChakraLink>}/>
              <br />
              <Link href="/customers">Customers</Link>
              <br />
              <Link href="/products">Products</Link>
            </DrawerBody>

            <DrawerFooter>
              <Link href="https://dashboard.stripe.com" isExternal>
                More Settings
              </Link>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
