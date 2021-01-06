import {
  Badge,
  Box,
  Flex,
  Heading,
  LinkBox,
  Spacer,
  Table,
  Text,
  Thead,
  Tr,
  Th,
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
  const InvoiceStatus = {
    draft: "grey.500",
    open: "blue.300",
    paid: "green.400",
  };
  return (
    <Layout>
      <Heading size="xl">Invoices</Heading>

      {invoices.map((invoice) => (
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
              <Badge
                autoCapitalize="true"
                bgColor={
                  invoice.status == "paid"
                    ? "green.400"
                    : invoice.status == "draft"
                    ? "grey.500"
                    : invoice.due_date < Date.now()
                    ? "red.300"
                    : invoice.status == "open"
                    ? "blue.300"
                    : null
                }
              >
                {invoice.due_date < Date.now() && invoice.status == "open"
                  ? "Late"
                  : invoice.status}
              </Badge>
            </Box>
          </Flex>
        </Box>
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
