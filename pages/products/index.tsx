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
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import Layout from "../../components/Layout";
import Stripe from "stripe";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function Products({
  products,
}: {
  products: Array<Stripe.Product>;
}) {
  // console.log(invoices);
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
        .map((product) => (
          <>
            <LinkBox
              href={"/products/" + product?.id}
              borderWidth="1px"
              borderRadius="10px"
              p="1em"
              m="1em"
            >
              <Flex>
                <Text>{product?.name}</Text>
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
                      as={Link}
                      // href={invoice?.invoice_pdf}
                      key="download"
                    >
                      Download
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </LinkBox>
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
