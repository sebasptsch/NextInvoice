import {
  Badge,
  Box,
  Flex,
  Heading,
  LinkBox,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import Layout from "../../components/Layout";
const stripe = require("stripe")(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN"
);
import InvoiceInterface from "../../interfaces/Invoice";

export default function Invoices({
  invoices,
}: {
  invoices: Array<InvoiceInterface>;
}) {
  // console.log(invoices);
  return (
    <Layout>
      <Heading size="xl">Invoices</Heading>
      {invoices.map((invoice) => (
        <>
          <Box
            as={LinkBox}
            href={"/invoices/" + invoice.id}
            borderWidth="1px"
            borderRadius="10px"
            p="1em"
            m="1em"
          >
            <Flex>
              <Box>{invoice.number}</Box>
              <Spacer />
              <Box>
                ${invoice.amount_due / 100}{" "}
                <Badge autoCapitalize="true">{invoice.status}</Badge>
              </Box>
            </Flex>
          </Box>
        </>
      ))}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await stripe.invoices.list({});
  const invoices = await res.data;

  return {
    props: {
      invoices,
    },
    revalidate: 1,
  };
}
