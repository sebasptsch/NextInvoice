import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import Stripe from "stripe";
import useSWR from "swr";
import ErrorHandler from "../../components/ErrorHandler";
import InvoiceItemList from "../../components/InvoiceItemList";
import { NextChakraLinkBox } from "../../components/NextChakraLinkBox";
import { fetcher } from "../../helpers/helpers";
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps(context) {
  const { id } = context.params;
  const invoice = await stripe.invoices.retrieve(id);
  return {
    props: {
      invoice,
    },
  };
}

export default function InvoicePage(props) {
  const router = useRouter();
  const { data: invoice, mutate } = useSWR(
    `/api/invoices/${router.query.id}`,
    fetcher,
    { initialData: props.invoice }
  );
  // Hooks
  const toast = useToast();

  return (
    <>
      <Head>
        <title>View Invoice {invoice?.number}</title>
      </Head>
      <Flex>
        <Heading size="xl" p={1}>
          ${invoice.amount_due / 100} <Badge>{invoice.status}</Badge>
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
            router.push(invoice.invoice_pdf);
          }}
          hidden={invoice.status === "draft"}
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
                mutate();
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
              .post(`/api/invoices/${invoice.id}/void`)
              .then((response) => {
                toast({
                  title: "Success",
                  status: "success",
                });
                mutate();
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
                mutate();
              })
              .catch((error) => ErrorHandler(error, toast));
          }}
        >
          Mark Uncollectible
        </Button>

        <Button
          key="pay"
          m={2}
          hidden={invoice.status === "paid"}
          onClick={() => {
            axios
              .post(`/api/invoices/${invoice.id}/pay`, {
                paid_out_of_band: true,
              })
              .then((response) => {
                toast({
                  title: "Success",

                  status: "success",
                });
                mutate();
              })
              .catch((error) => ErrorHandler(error, toast));
          }}
        >
          Pay (Out of Hand)
        </Button>

        <Button
          m={2}
          hidden={invoice.status !== "draft"}
          key="Delete"
          onClick={() => {
            axios
              .delete(`/api/invoices/${invoice.id}`)
              .then((response) => {
                toast({
                  title: "Success",
                  status: "success",
                });
                router.push(`/invoices`);
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
                mutate();
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
            <Td>${invoice.amount_due / 100}</Td>
          </Tr>
          <Tr>
            <Td>Status</Td>
            <Td>{invoice.status}</Td>
          </Tr>
        </Tbody>
      </Table>
      <br />
      <br />
      <InvoiceItemList invoice={invoice} />
    </>
  );
}
