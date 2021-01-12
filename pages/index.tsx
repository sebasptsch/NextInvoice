import {
  Heading,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import ErrorHandler from "../components/ErrorHandler";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Array<Stripe.Invoice>>();
  const toast = useToast();
  useEffect(() => {
    axios
      .get(`/api/invoices`, {
        params: {
          status: "open",
        },
      })
      .then((response) => setInvoices(response.data.data))
      .catch((error) => ErrorHandler(error, toast));
  }, []);
  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Heading>Dashboard</Heading>
      <br />
      <StatGroup textAlign="center" borderWidth="1px" borderRadius="10px">
        <Stat>
          <StatNumber>
            ${invoices?.reduce((a, b) => a + b.amount_due, 0) / 100}
          </StatNumber>
          <StatLabel>Waiting for</StatLabel>
          <StatHelpText>The amount left in unpaid invoices</StatHelpText>
        </Stat>
        <Stat>
          <StatNumber></StatNumber>
          <StatLabel></StatLabel>
          <StatHelpText></StatHelpText>
        </Stat>
      </StatGroup>
      <br />
    </Layout>
  );
}
