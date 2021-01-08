import Layout from "../../../components/Layout";

import Stripe from "stripe";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
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

import InvoiceList from "../../../components/InvoiceList";
import Head from "next/head";
import { NextChakraLink } from "../../../components/NextChakraLink";
import { useRouter } from "next/router";

export default function CustomerPage({
  customer,
}: {
  customer: Stripe.Customer;
}) {
  const router = useRouter();

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
      <ButtonGroup spacing={4} direction="row" w="100%" m={2}>
        <Button
          onClick={() =>
            router.push(
              `/customers/[id]/edit`,
              `/customers/${customer.id}/edit`
            )
          }
        >
          Edit
        </Button>
        <Button>Delete</Button>
      </ButtonGroup>
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
              <Badge m={1} key={value}>
                {value}
              </Badge>
            ))}
          </Text>
        </Box>
      </Flex>
      <InvoiceList customerId={customer.id} />
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
