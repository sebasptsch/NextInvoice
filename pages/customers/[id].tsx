import Layout from "../../components/Layout";

import Stripe from "stripe";
import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Select,
  Spacer,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import InvoiceComponent from "../../components/Invoice";
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

export default function CustomerPage({
  customer,
  invoices,
}: {
  customer: Stripe.Customer;
  invoices: Array<Stripe.Invoice>;
}) {
  const [value, setValue] = useState("open");
  const handleStatus = (e) => {
    setValue(e.target.value);
  };
  const invoiceSearch = invoices
    .filter((invoice) => invoice.status === value || value === "all")
    .sort((invoice) => invoice.due_date);
  return (
    <Layout>
      <Heading>{customer.name}</Heading>
      <Text color="gray.500">{customer.email}</Text>
      <br />
      <Divider />
      <br />
      <StatGroup>
        <Stat>
          <StatLabel>Balance</StatLabel>
          <StatNumber>${customer.balance / 100}</StatNumber>
          <StatHelpText></StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Customer Since</StatLabel>
          <StatNumber>
            {new Date(customer.created * 1000).toDateString()}
          </StatNumber>
          <StatHelpText></StatHelpText>
        </Stat>
      </StatGroup>
      <br />

      <Flex>
        <Heading marginTop="1em" marginBottom="0.5em" size="lg">
          Invoices
        </Heading>
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

      <Divider marginBottom={2} />
      {invoiceSearch.length != 0 ? (
        invoiceSearch.map((invoice) => (
          <>
            <InvoiceComponent invoice={invoice} key={invoice.id} />
          </>
        ))
      ) : (
        <Text>No invoices here.</Text>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const customer = await stripe.customers.retrieve(params.id);
  const invoices = await stripe.invoices.list({ customer: customer.id });
  return {
    props: {
      customer,
      invoices: invoices.data,
    },
  };
}

// export async function getStaticPaths() {
//   const res = await stripe.customers.list();
//   const customers = await res.data;

//   // console.log(allPosts?.map((post) => `/blog/${post.id}`));
//   //   console.log(invoices);
//   return {
//     paths:
//       (await customers?.map((customer) => `/customers/${customer?.id}`)) || [],
//     fallback: true,
//   };
// }
