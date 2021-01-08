import Layout from "../../../components/Layout";

import Stripe from "stripe";
import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Link,
  Select,
  Spacer,
  Spinner,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import InvoiceComponent from "../../../components/Invoice";
import axios from "axios";

import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import Head from "next/head";
import { NextChakraLink } from "../../../components/NextChakraLink";

export default function CustomerPage({
  customer,
}: {
  customer: Stripe.Customer;
}) {
  const [invoices, setInvoices] = useState([]);
  const [loading, isLoading] = useState(false);
  const [value, setValue] = useState("open");
  useEffect(() => {
    isLoading(true);
    setInvoices([]);
    axios({
      method: "GET",
      url: "/api/invoices",
      params: {
        status: value,
        customer: customer.id,
      },
    }).then((response) => {
      setInvoices(response.data.data.sort((invoice) => invoice.due_date));
      isLoading(false);
    });
  }, [value]);

  const handleStatus = (e) => {
    setValue(e.target.value);
  };
  return (
    <Layout>
      <Head>
        <title>View Customer</title>
      </Head>
      <Heading>{customer.name}</Heading>
      <NextChakraLink color="gray.500" href={`mailto: ${customer.email}`}>
        {customer.email}
      </NextChakraLink>
      <br />
      <NextChakraLink color="gray.500" href={`tel: ${customer.phone}`}>
        {customer?.phone}
      </NextChakraLink>
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
        <Box m={2} w="100%">
          <Heading marginTop="1em" marginBottom="0.5em" size="lg">
            Description
          </Heading>
          <Divider marginBottom={2} />
          <Text>{customer.description}</Text>
        </Box>
        <Box m={2} w="100%">
          <Heading marginTop="1em" marginBottom="0.5em" size="lg">
            Students
          </Heading>
          <Divider marginBottom={2} />
          <Text>
            {JSON.parse(customer.metadata?.students).map((value) => (
              <Badge m={1}>{value}</Badge>
            ))}
          </Text>
        </Box>
      </Flex>

      <Flex>
        <Heading marginTop="1em" marginBottom="0.5em" size="lg">
          Invoices
        </Heading>
        <Spacer />
        <Center>
          <Select value={value} onChange={handleStatus}>
            {/* <option value="all">All</option> */}
            <option value="draft" key="draft">
              Draft
            </option>
            <option value="open" key="open">
              Open
            </option>
            <option value="paid" key="paid">
              Paid
            </option>
            <option value="uncollectible" key="uncollectible">
              Uncollectible
            </option>
            <option value="void" key="void">
              Void
            </option>
          </Select>
        </Center>
      </Flex>

      <Divider marginBottom={2} />
      {loading ? (
        <Box
          borderWidth="1px"
          borderRadius="10px"
          p="1em"
          m="1em"
          height="82px"
        >
          <SkeletonText height="100%" />
        </Box>
      ) : null}
      {invoices.length != 0 ? (
        invoices.map((invoice) => (
          <>
            <InvoiceComponent invoice={invoice} key={invoice.id} />
          </>
        ))
      ) : loading ? null : (
        <Text>No invoices here.</Text>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const customer = await stripe.customers.retrieve(params.id);
  return {
    props: {
      customer,
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
