import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonText,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import { NextChakraLink } from "../../components/NextChakraLink";
import { useProducts } from "../../extras/resourceHooks";

export default function Products() {
  // Hooks
  const router = useRouter();
  const [value, setValue] = useState("");
  const {
    products,
    isLoading,
    mutate,
    setSize,
    size,
    has_more,
    isLoadingMore,
  } = useProducts(20);
  const toast = useToast();
  // Component Functions
  const handleChange = (event) => setValue(event.target.value);

  const filteredProducts = products?.filter((product) =>
    product?.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Flex>
        <Heading size="lg">Products</Heading> <Spacer />
        <IconButton
          aria-label="Add Product"
          icon={<AddIcon />}
          onClick={() => router.push("/products/new")}
        />
      </Flex>
      <Center marginTop="1em">
        <Input
          placeholder="Search Products"
          value={value}
          onChange={handleChange}
        />
      </Center>
      <br />
      <Divider />
      <br />
      {isLoading ? (
        <Box borderWidth="1px" borderRadius="10px" p="1em" m="1em">
          <SkeletonText h="52px" />
        </Box>
      ) : null}
      {filteredProducts
        ?.sort((product) => (product.active ? -1 : 1))
        ?.map((product) => (
          <Box
            borderWidth="1px"
            borderRadius="10px"
            p="1em"
            m="1em"
            key={product.id}
          >
            <Flex>
              <NextChakraLink href={`/products/${product.id}`}>
                {product.name}
              </NextChakraLink>
              <Spacer />
              <Center>
                <Badge colorScheme={product.active ? "green" : "red"}>
                  {product.active ? "Enabled" : "Disabled"}
                </Badge>
                <Menu>
                  <MenuButton
                    as={Button}
                    size={"sm"}
                    rightIcon={<ChevronDownIcon />}
                    marginLeft="1em"
                  >
                    Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        axios
                          .post(`/api/products/${product.id}`, {
                            active: !product.active,
                          })
                          .then((response) => {
                            if (response.status === 200) {
                              toast({
                                title: "Success",
                                status: "success",
                              });
                              mutate();
                            }
                          })
                          .catch((error) => ErrorHandler(error, toast));
                      }}
                      key="delete"
                    >
                      {product.active ? "Disable" : "Enable"}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Center>
            </Flex>
          </Box>
        ))}
      <Center>
        <Button
          onClick={() => setSize(size + 1)}
          disabled={!has_more || products?.length === 0 || isLoading}
          isLoading={isLoadingMore}
        >
          Load More
        </Button>
      </Center>
    </>
  );
}
