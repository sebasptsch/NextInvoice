import { ExternalLinkIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { NextChakraLink } from "./NextChakraLink";

export default function DrawerNavigation({ isOpen, onClose, btnRef }) {
  // Hooks

  const { colorMode, toggleColorMode } = useColorMode();
  const session = useSession();
  const router = useRouter();

  return (
    <>
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
              <NextChakraLink href="/invoices">Invoices</NextChakraLink>
              {/* <br />
              <NextChakraLink ml={4} href="/newlessoninvoice">
                Invoice for Lessons
              </NextChakraLink> */}
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
