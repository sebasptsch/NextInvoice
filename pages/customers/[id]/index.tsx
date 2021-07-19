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
import { useSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import BalanceModal from "../../../components/BalanceModal";
import InvoiceList from "../../../components/InvoiceList";
import Layout from "../../../components/Layout";
import { NextChakraLink } from "../../../components/NextChakraLink";
import { useCustomer } from "../../../extras/resourceHooks";

export default function CustomerPage() {
  // Hooks
  const router = useRouter();
  const { customer, isLoading } = useCustomer(router.query.id);
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && (loading || isLoading)) return null;

  if (session) {
    return (
      <Layout>
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
              ${customer ? -customer?.balance / 100 : ""}{" "}
              <BalanceModal customer={customer} />
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
  return <p>Access Denied</p>;
}
