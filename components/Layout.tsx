import { Box, Button, Container, useColorMode } from "@chakra-ui/react";

export default function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box p="1em" w="100%">
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </Box>
      <Container>{children}</Container>
      <Box w="100%">Foooter</Box>
    </>
  );
}
