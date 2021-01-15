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
import useSWR from "swr";
import ErrorHandler from "../components/ErrorHandler";
import Layout from "../components/Layout";
import { listFetcher, useInvoices } from "../helpers/helpers";

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps() {
  const invoices = await stripe.invoices.list({ limit: 100, status: "open" });
  return {
    props: {
      invoices: invoices.data,
    },
  };
}

export default function Dashboard(props) {
  const { data: invoices } = useSWR(`/api/invoices?status=open`, listFetcher, {
    initialData: props.invoices,
  });
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
