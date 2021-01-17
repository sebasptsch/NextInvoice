import { getSession } from "next-auth/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    redirect: {
      destination: "/invoices",
      permanent: false,
    },
  };
}

export default function Dashboard(props) {
  return <></>;
}
