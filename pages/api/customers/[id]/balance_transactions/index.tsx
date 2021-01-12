import Stripe from "stripe";
import { getSession } from "next-auth/client";

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(403).json({
      message: "Please Login using valid credentials",
    });
  }
  if (req.method === "GET") {
    await stripe.customers
      .listBalanceTransactions(req.query.id)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(error.statusCode).json(error));
  }
  if (req.method === "POST") {
    await stripe.customers
      .createBalanceTransaction(req.query.id, req.body)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(error.statusCode).json(error));
  }
}
