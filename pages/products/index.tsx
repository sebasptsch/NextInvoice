import { Badge, Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import Layout from "../../components/Layout";
const stripe = require("stripe")(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN"
);

export default function Products({ products }) {
  // console.log(invoices);
  return (
    <Layout>
      <Heading size="xl">Products</Heading>
      {products.map((product) => (
        <>
          <Box borderWidth="1px" borderRadius="10px" p="1em" m="1em">
            <Flex>
              <Box as="a" href={"/products/" + product.id}>
                {product.name}
              </Box>
              <Spacer />
              <Box></Box>
            </Flex>
          </Box>
        </>
      ))}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await stripe.products.list({});
  const products = await res.data;
  //   console.log(customers);

  return {
    props: {
      products,
    },
    revalidate: 1,
  };
}
