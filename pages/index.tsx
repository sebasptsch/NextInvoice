import {
  Heading,
  Spinner,
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
import { useInvoices } from "../helpers/helpers";

export default function Dashboard() {
  const { invoices, isLoading } = useInvoices("open");
  if (isLoading) return <Spinner />;
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
            ${invoices.reduce((a, b) => a + b.amount_due, 0) / 100}
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

export async function getServerSideProps({ params }) {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const invoices = await stripe.invoices.list({ status: "open" });
  return {
    props: {
      invoices: invoices.data,
    },
  };
}
