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
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import {
  ExternalLinkIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { NextChakraLink } from "./NextChakraLink";
import { useRouter } from "next/router";

export default function DrawerNavigation() {
  // Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { colorMode, toggleColorMode } = useColorMode();
  const session = useSession();
  const router = useRouter();

  return (
    <>
      <IconButton
        aria-label="Menu"
        ref={btnRef}
        onClick={onOpen}
        icon={<HamburgerIcon />}
        variant="outline"
      />
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
              <ButtonGroup>
                <IconButton
                  aria-label="change theme"
                  onClick={toggleColorMode}
                  icon={colorMode === "light" ? <SunIcon /> : <MoonIcon />}
                />
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
              </ButtonGroup>

              <br />
              <br />
              <NextChakraLink href="/">Dashboard</NextChakraLink>
              <br />
              <NextChakraLink href="/invoices">Invoices</NextChakraLink>
              <br />
              <NextChakraLink ml={4} href="/newlessoninvoice">
                Invoice for Lessons
              </NextChakraLink>
              <br />
              <NextChakraLink href="/customers">Customers</NextChakraLink>
              <br />
              <NextChakraLink href="/products">Products</NextChakraLink>
              <br />
              <NextChakraLink href="https://dashboard.stripe.com/reports">
                Reports
                <ExternalLinkIcon mx="2px" />
              </NextChakraLink>
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
