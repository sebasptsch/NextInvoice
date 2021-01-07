import { ChevronDownIcon } from "@chakra-ui/icons";
import { Center, Flex, Heading, Select, Spacer } from "@chakra-ui/react";

import Layout from "../../components/Layout";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

import { useToast } from "@chakra-ui/react";
import InvoiceComponent from "../../components/Invoice";
import { useState } from "react";

export default function Invoices({
  invoices,
}: {
  invoices: Array<Stripe.Invoice>;
}) {
  const [value, setValue] = useState("open");
  const handleStatus = (e) => {
    setValue(e.target.value);
  };
  return (
    <Layout>
      <Flex>
        <Heading size="xl">Invoices</Heading>
        <Spacer />
        <Center>
          <Select value={value} onChange={handleStatus}>
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="paid">Paid</option>
            <option value="uncollectible">Uncollectible</option>
            <option value="void">Void</option>
          </Select>
        </Center>
      </Flex>
      {invoices
        .filter((invoice) => invoice.status === value || value === "all")
        .sort((invoice) => invoice.due_date)
        .map((invoice) => {
          return <InvoiceComponent invoice={invoice} key={invoice.id} />;
        })}
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await stripe.invoices.list({});
  const invoices = await res.data;

  return {
    props: {
      invoices,
    },
  };
}
