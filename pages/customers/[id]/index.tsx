import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Heading,
  ListItem,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Stripe from "stripe";
import BalanceModal from "../../../components/BalanceModal";
import InvoiceList from "../../../components/InvoiceList";
import { NextChakraLink } from "../../../components/NextChakraLink";
import { useCustomer, usePrices } from "../../../helpers/helpers";

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps(context) {
  const { id } = context.params;
  const customer = await stripe.customers.retrieve(id);
  const prices = await stripe.prices.list();

  return {
    props: {
      prices,
      customer,
    },
  };
}

export default function CustomerPage(props) {
  // Hooks
  const router = useRouter();
  const { prices } = usePrices(undefined, props.prices);
  const { customer } = useCustomer(props.customer.id, props.customer);

  return (
    <>
      <Head>
        <title>
          View Customer{" "}
          {customer?.name?.length > 0 ? customer?.name : customer?.email}
        </title>
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
        {/* <Button>Delete</Button> */}
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
    </>
  );
}
