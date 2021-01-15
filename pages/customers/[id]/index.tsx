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
  IconButton,
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
import BalanceModal from "../../../components/BalanceModal";

import { useCustomer, usePrices } from "../../../helpers/helpers";

export default function CustomerPage() {
  // Hooks
  const router = useRouter();
  if (!router.query.id) return null;
  const { customer, isLoading } = useCustomer(router.query.id);
  const { prices } = usePrices();

  if (isLoading) return <Spinner />;
  return (
    <Layout>
      <Head>
        <title>View Customer</title>
      </Head>
      <Heading as="a" href={`mailto: ${customer?.email}`}>
        {customer?.email}
      </Heading>
      <Text color="gray.500">{customer?.name}</Text>
      <br />
      <NextChakraLink color="gray.500" href={`tel: ${customer?.phone}`}>
        {customer?.phone}
      </NextChakraLink>
      <br />
      <Divider />
      <ButtonGroup spacing={4} direction="row" w="100%" m={2}>
        <Button
          onClick={() =>
            router.push(
              `/customers/[id]/edit`,
              `/customers/${customer?.id}/edit`
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
          <StatNumber>
            ${-customer?.balance / 100} <BalanceModal customer={customer} />
          </StatNumber>
          <StatHelpText></StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Customer Since</StatLabel>
          <StatNumber>
            {new Date(customer?.created * 1000).toDateString()}
          </StatNumber>
          <StatHelpText></StatHelpText>
        </Stat>
      </StatGroup>
      {customer?.description || customer?.description?.length > 0 ? (
        <>
          <Heading marginTop="1em" marginBottom="0.5em" size="lg">
            Description
          </Heading>
          <Divider marginBottom={2} />
          <Text>{customer?.description}</Text>
          <br />
        </>
      ) : null}

      <Box w="100%">
        <Heading marginTop="1em" marginBottom="0.5em" size="lg">
          Classes
        </Heading>
        <Divider marginBottom={2} />
        <UnorderedList>
          {customer?.metadata?.classes
            ? JSON.parse(customer?.metadata.classes)?.map((customerclass) => {
                return (
                  <ListItem key={customerclass.priceid}>
                    {customerclass?.amount +
                      "x " +
                      prices?.find(
                        (price) => price.id === customerclass.priceid
                      )?.nickname}
                  </ListItem>
                );
              })
            : null}
        </UnorderedList>
      </Box>
      <Box w="100%">
        <Heading marginTop="1em" marginBottom="0.5em" size="lg">
          Students
        </Heading>
        <Divider marginBottom={2} />
        <UnorderedList>
          {customer?.metadata.students
            ? JSON.parse(customer?.metadata?.students).map((value) => (
                <ListItem key={value}>{value}</ListItem>
              ))
            : null}
        </UnorderedList>
      </Box>

      <br />
      <InvoiceList customer={customer?.id} />
    </Layout>
  );
}
