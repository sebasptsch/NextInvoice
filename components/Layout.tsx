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

export default function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box p="1em" w="100%">
        <Flex>
          <Button onClick={toggleColorMode}>
            Toggle {colorMode === "light" ? "Dark" : "Light"}
          </Button>
          <Spacer />
          <Button as="a" href="/invoices/create">
            Create Invoice
          </Button>
        </Flex>
      </Box>
      <Container>{children}</Container>
      <Box w="100%">Foooter</Box>
    </>
  );
}
