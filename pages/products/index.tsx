import {
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  Input,
  LinkBox,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import Layout from "../../components/Layout";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

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
                {product?.name}
                <Text></Text>
              </Flex>
            </LinkBox>
          </>
        ))}
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await stripe.products.list({});
  const products = await res.data;
  //   console.log(customers);

  return {
    props: {
      products,
    },
  };
}
