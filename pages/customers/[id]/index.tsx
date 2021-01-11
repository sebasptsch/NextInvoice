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
  ListItem,
  Select,
  Spacer,
  Spinner,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";

import InvoiceList from "../../../components/InvoiceList";
import Head from "next/head";
import { NextChakraLink } from "../../../components/NextChakraLink";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ErrorHandler from "../../../components/ErrorHandler";

export default function CustomerPage({
  customer,
}: {
  customer: Stripe.Customer;
}) {
  // Hooks
  const toast = useToast();
  const router = useRouter();
  const [prices, setPrices] = useState<Array<Stripe.Price>>([]);
  useEffect(() => {
    axios
      .get(`/api/prices`)
      .then((response) => {
        setPrices(response.data.data);
      })
      .catch((error) => ErrorHandler(error, toast));
  }, []);

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
      {customer.description || customer.description?.length > 0 ? (
        <>
          <Heading marginTop="1em" marginBottom="0.5em" size="lg">
            Description
          </Heading>
          <Divider marginBottom={2} />
          <Text>{customer.description}</Text>
          <br />
        </>
      ) : null}

      <Box w="100%">
        <Heading marginTop="1em" marginBottom="0.5em" size="lg">
          Classes
        </Heading>
        <Divider marginBottom={2} />
        <UnorderedList>
          {JSON.parse(customer.metadata.classes)?.map((customerclass) => {
            const matched = prices?.find(
              (price) => price.id === customerclass.priceid
            );
            return (
              <ListItem key={customerclass.priceid}>
                {customerclass?.amount + "x " + matched?.nickname}
              </ListItem>
            );
          })}
        </UnorderedList>
      </Box>
      <Box w="100%">
        <Heading marginTop="1em" marginBottom="0.5em" size="lg">
          Students
        </Heading>
        <Divider marginBottom={2} />
        <UnorderedList>
          {JSON.parse(customer.metadata?.students).map((value) => (
            <ListItem key={value}>{value}</ListItem>
          ))}
        </UnorderedList>
      </Box>

      <br />
      <InvoiceList customer={customer.id} />
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
