import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Spacer,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Tfoot,
  useToast,
  LinkBox,
  ButtonGroup,
  Stack,
} from "@chakra-ui/react";
import Layout from "../../../components/Layout";
import Stripe from "stripe";
import axios from "axios";
import Head from "next/head";
import { NextChakraLinkBox } from "../../../components/NextChakraLinkBox";
import ErrorHandler from "../../../components/ErrorHandler";
import InvoiceItemList from "../../../components/InvoiceItemList";
import { useRouter } from "next/router";

export default function InvoicePage({ invoice }: { invoice: Stripe.Invoice }) {
  // Hooks
  const toast = useToast();
  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title>View Invoice {invoice?.number}</title>
      </Head>
      <Flex>
        <Heading size="xl" p={1}>
          ${invoice?.amount_due / 100} <Badge>{invoice?.status}</Badge>
        </Heading>
        <Spacer />
        <Center>
          <Text>{invoice?.number}</Text>
        </Center>
      </Flex>
      <Box>
        <Button
          m={2}
          onClick={() =>
            router.push("/invoices/[id]", "/invoices/" + invoice?.id)
          }
          hidden={invoice.status !== "draft"}
        >
          Edit
        </Button>
        <Button
          m={2}
          key="download"
          onClick={() => {
            router.push(invoice?.invoice_pdf);
          }}
          hideen={invoice.status === "draft"}
        >
          Download
        </Button>

        <Button
          m={2}
          href={invoice.hosted_invoice_url}
          key="webpage"
          hidden={invoice.status !== "open"}
        >
          Checkout Page
        </Button>
        <Button
          m={2}
          key="send"
          hidden={invoice.status !== ("open" || "draft")}
          onClick={() => {
            axios
              .post(`/api/invoices/${invoice?.id}/send`)
              .then((response) => {
                toast({
                  title: "Sent!",
                  status: "success",
                });
                router.reload();
              })
              .catch((error) => ErrorHandler(error, toast));
          }}
        >
          Send
        </Button>
        <Button
          m={2}
          key="Void"
          hidden={invoice.status !== ("open" || "uncollectible")}
          onClick={() => {
            axios
              .post(`/api/invoices/${invoice?.id}/void`)
              .then((response) => {
                toast({
                  title: "Success",
                  status: "success",
                });
                router.reload();
              })
              .catch((error) => ErrorHandler(error, toast));
          }}
        >
          Void
        </Button>
        <Button
          m={2}
          key="mark_uncollectible"
          hidden={invoice.status !== "open"}
          onClick={() => {
            axios
              .post(`/api/invoices/${invoice?.id}/mark_uncollectible`)
              .then((response) => {
                toast({
                  title: "Success",

                  status: "success",
                });
                router.reload();
              })
              .catch((error) => ErrorHandler(error, toast));
          }}
        >
          Mark Uncollectible
        </Button>

        <Button
          m={2}
          key="pay"
          hidden={invoice.status === "paid"}
          onClick={() => {
            axios
              .post(`/api/invoices/${invoice?.id}/pay`)
              .then((response) => {
                toast({
                  title: "Success",

                  status: "success",
                });
                router.reload();
              })
              .catch((error) => ErrorHandler(error, toast));
          }}
        >
          Pay
        </Button>

        <Button
          m={2}
          hidden={invoice.status !== "draft"}
          key="Delete"
          onClick={() => {
            axios
              .delete(`/api/invoices/${invoice?.id}`)
              .then((response) => {
                toast({
                  title: "Success",
                  status: "success",
                });
                router.reload();
              })
              .catch((error) => ErrorHandler(error, toast));
          }}
        >
          Delete
        </Button>
        <Button
          m={2}
          key="finalize"
          hidden={invoice.status !== "draft"}
          onClick={() => {
            axios
              .post(`/api/invoices/${invoice.id}/finalize`)
              .then((response) => {
                toast({
                  title: "Success",
                  status: "success",
                });
                router.reload();
              })
              .catch((error) => ErrorHandler(error, toast));
          }}
        >
          Finalize
        </Button>
      </Box>
      <Divider m="1em 0 1em 0" />

      <Flex>
        <Box padding="0 2em 0 2em">
          <Text color="gray.500">Due Date</Text>
          <Text>{new Date(invoice?.due_date * 1000).toLocaleDateString()}</Text>
        </Box>
        <Divider orientation="vertical" h="4em" />
        <NextChakraLinkBox
          as={`/customers/${invoice.customer}`}
          href={`/customers/[id]`}
          padding="0 2em 0 2em"
        >
          <Text color="gray.500">Customer</Text>
          <Text>{invoice?.customer_name}</Text>
        </NextChakraLinkBox>
      </Flex>
      <br />
      <br />
      <Heading size={"md"}>Payment Details</Heading>
      <Divider m="1em 0 1em 0" />
      <Table>
        <Tbody>
          <Tr>
            <Td>Amount</Td>
            <Td>${invoice?.amount_due / 100}</Td>
          </Tr>
          <Tr>
            <Td>Status</Td>
            <Td>{invoice?.status}</Td>
          </Tr>
        </Tbody>
      </Table>
      <br />
      <br />
      <InvoiceItemList invoice={invoice} />
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const invoice = await stripe.invoices.retrieve(params.id);

  return {
    props: {
      invoice,
    },
  };
}
