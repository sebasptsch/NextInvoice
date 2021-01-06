import {
  Box,
  Button,
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
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import DrawerNavigation from "./Drawer";

export default function Layout({
  children,
  noContainer,
}: {
  children: any;
  noContainer?: boolean;
}) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box p="1em" w="100%">
        <Flex>
          <Button onClick={toggleColorMode}>
            Toggle {colorMode === "light" ? "Dark" : "Light"}
          </Button>
          <Spacer />
          <DrawerNavigation />
          {/* <Button as="a" href="/invoices/create">
            Create Invoice
          </Button> */}
        </Flex>
      </Box>
      {noContainer ? children : <Container>{children}</Container>}
      <Box w="100%">Foooter</Box>
    </>
  );
}
