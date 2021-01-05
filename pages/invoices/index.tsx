import { Badge, Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import Layout from "../../components/Layout";
const stripe = require("stripe")(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN"
);

export default function Invoices({ invoices }) {
  return (
    <Layout>
      <Heading size="xl">Test</Heading>
      {/* {JSON.stringify(invoices)} */}
      {invoices.map((invoice) => (
        <Box borderWidth="1px" borderRadius="10px" p="1em" key={invoice.id}>
          <Flex>
            <Box>
              <Link href={"/invoices/" + invoice.id}>{invoice.id}</Link>
            </Box>
            <Spacer />
            <Box>
              ${invoice.amount_due / 100}{" "}
              <Badge autoCapitalize="true">{invoice.status}</Badge>
            </Box>
          </Flex>
        </Box>
      ))}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await stripe.invoices.list({ limit: 3 });
  const invoices = await res.data;

  return {
    props: {
      invoices,
    },
    revalidate: 1,
  };
}
