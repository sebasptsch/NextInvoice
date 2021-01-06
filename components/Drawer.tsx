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

            {/* <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button color="blue">Save</Button>
            </DrawerFooter> */}
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
