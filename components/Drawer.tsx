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
  Link,
} from "@chakra-ui/react";
import { useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/client";

export default function DrawerNavigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Open
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
              <Link href="/invoices">Invoices</Link>
              <br />
              <Link href="/customers">Customers</Link>
              <br />
              <Link href="/products">Products</Link>
            </DrawerBody>

            <DrawerFooter>
              <Link href="https://dashboard.stripe.com" isExternal>
                More Settings
              </Link>
              <Button m={"1em"} as="button" onClick={() => signOut}>
                Logout
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
