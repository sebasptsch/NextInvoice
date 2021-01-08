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
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import Layout from "../../components/Layout";
import Stripe from "stripe";
import { ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useRouter } from "next/router";

export default function Products({
  products,
}: {
  products: Array<Stripe.Product>;
}) {
  const toast = useToast();
  const router = useRouter();
  const [value, setValue] = useState("");
  const handleChange = (event) => setValue(event.target.value);
  //   console.log(products);
  return (
    <Layout>
      <Flex>
        <Heading size="xl">Products</Heading> <Spacer />
        <Center>
          <Input
            placeholder="Search Products"
            value={value}
            onChange={handleChange}
          />
        </Center>
      </Flex>

      {products
        .filter((product) =>
          product?.name.toLowerCase().includes(value.toLowerCase())
        )
        .sort((product) => (product.active ? -1 : 1))
        .map((product) => (
          <>
            <Box borderWidth="1px" borderRadius="10px" p="1em" m="1em">
              <Flex>
                <Link href={`/products/${product.id}`}>{product.name}</Link>
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
                                  description:
                                    "Reload the page to see the changes.",
                                  status: "success",
                                });
                                router.reload();
                              }
                            })
                            .catch((error) => {
                              // console.log("error", error.message);
                              toast({
                                title: error.response.data.type,
                                status: "error",
                                description: error.response.data.raw.message,
                              });
                            });
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
          </>
        ))}
    </Layout>
  );
}

export async function getServerSideProps() {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const res = await stripe.products.list({});
  const products = await res.data;
  //   console.log(customers);

  return {
    props: {
      products,
    },
  };
}
