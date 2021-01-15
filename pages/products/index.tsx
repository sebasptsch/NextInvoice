import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  LinkBox,
  MenuButton,
  MenuItem,
  MenuList,
  Menu,
  Spacer,
  Text,
  useToast,
  Spinner,
  SkeletonText,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Stripe from "stripe";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import ErrorHandler from "../../components/ErrorHandler";
import { useProducts } from "../../helpers/helpers";
import { NextChakraLink } from "../../components/NextChakraLink";

export default function Products() {
  // Hooks
  const router = useRouter();
  const [value, setValue] = useState("");
  const { products, isLoading, mutate } = useProducts();
  const toast = useToast();
  // Component Functions
  const handleChange = (event) => setValue(event.target.value);

  return (
    <Layout>
      <Head>
        <title>Products</title>
      </Head>
      <Flex>
        <Heading size="lg">Products</Heading> <Spacer />
        <IconButton
          aria-label="Add Product"
          icon={<AddIcon />}
          onClick={() => router.push("/products/new", "/products/new")}
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
      {products
        ?.filter((product) =>
          product?.name.toLowerCase().includes(value.toLowerCase())
        )
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
    </Layout>
  );
}
