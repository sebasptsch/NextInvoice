import Stripe from "stripe";

import Layout from "../../../components/Layout";

import Head from "next/head";

export default function EditInvoice({
  invoice,
  prices,
}: {
  invoice: Stripe.Invoice;
  prices: Array<Stripe.Price>;
}) {
  return (
    <Layout>
      <Head>
        <title>Edit Invoice</title>
      </Head>
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
