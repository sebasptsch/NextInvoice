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
  TableCaption,
  Button,
  Tfoot,
  useToast,
  LinkBox,
} from "@chakra-ui/react";
import Layout from "../../../components/Layout";
import Stripe from "stripe";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { NextChakraLinkBox } from "../../../components/NextChakraLinkBox";

export default function InvoicePage({ invoice }: { invoice: Stripe.Invoice }) {
  const toast = useToast();
  return (
    <Layout>
      <Head>
        <title>View Invoice</title>
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
        <Button href={invoice?.invoice_pdf} m={2}>
          Download Invoice
        </Button>
        <Button
          onClick={() => {
            axios.post(`/api/invoices/${invoice?.id}/send`).catch((error) => {
              // console.log("error", error.message);
              toast({
                title: error.response.data.type,
                status: "error",
                description: error.response.data.raw.message,
              });
            });
          }}
          m={2}
        >
          Re-send Email
        </Button>
        <Button m={2} as={"a"} href={invoice?.hosted_invoice_url}>
          Payment Page
        </Button>
        {/* <Button m={2}></Button> */}
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
        {/* <Box m="1em">
          <Text color="gray.500">Date</Text>
          <Text>{new Date(invoice?.due_date).toLocaleDateString()}</Text>
        </Box> */}
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
      <Heading size={"md"}>Summary</Heading>
      <Divider m="1em 0 1em 0" />
      <Box overflow="auto">
        <Table overflowY="scroll">
          <Thead>
            <Tr>
              <Th>Description</Th>
              <Th>QTY</Th>
              <Th>Unit Price</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoice?.lines.data.map((product) => (
              <Tr key={product.id}>
                <Td>{product.description}</Td>
                <Td isNumeric>{product.quantity}</Td>
                <Td isNumeric>${product.price.unit_amount / 100}</Td>
                <Td isNumeric>${product.amount / 100}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td></Td>
              <Td></Td>
              <Td>
                <Text textAlign="right" fontWeight="bold">
                  Subtotal
                </Text>
              </Td>
              <Td isNumeric>${invoice?.subtotal / 100}</Td>
            </Tr>
            {invoice?.discount ? (
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td>
                  <Text textAlign="right" fontWeight="lighter">
                    {invoice?.discount.coupon.name}
                  </Text>
                </Td>
                <Td isNumeric>
                  -$
                  {(invoice?.subtotal *
                    (invoice?.discount.coupon.percent_off / 100)) /
                    100}
                </Td>
              </Tr>
            ) : null}
            <Tr>
              <Td></Td>
              <Td></Td>
              <Td>
                <Text textAlign="right" fontWeight="bold">
                  Total
                </Text>
              </Td>
              <Td isNumeric>${invoice?.total / 100}</Td>
            </Tr>
            <Tr>
              <Td></Td>
              <Td></Td>
              <Td>
                <Text textAlign="right" fontWeight="bold">
                  Amount Due
                </Text>
              </Td>
              <Td isNumeric>${invoice?.amount_due / 100}</Td>
            </Tr>
          </Tfoot>
        </Table>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const invoice = await stripe.invoices.retrieve(params.id);
  //   console.log(invoice);
  //   const invoice = await res.invoice;
  //   console.log(await stripe.invoices.retrieve("in_1HQXddIK06OmoiJkg9DVgibR"));
  //   console.log(invoice);
  return {
    props: {
      invoice,
    },
  };
}

// export async function getStaticPaths() {
//   const res = await stripe.invoices.list();
//   const invoices = await res.data;

//   // console.log(allPosts?.map((post) => `/blog/${post.id}`));
//   //   console.log(invoices);
//   return {
//     paths: (await invoices?.map((invoice) => `/invoices/${invoice?.id}`)) || [],
//     fallback: true,
//   };
// }
