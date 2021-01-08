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
  if (req.method == "POST") {
    await stripe.invoices
      .create(req.body)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
  if (req.method == "GET") {
    await stripe.invoices
      .list(req.query)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
}
