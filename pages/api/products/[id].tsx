import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

import { getSession } from "next-auth/client";
export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(403).json({
      message: "Please Login using valid credentials",
    });
  }
  if (req.method === "GET") {
    await stripe.products
      .retrieve(req.query.id)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
  if (req.method === "POST") {
    await stripe.products
      .update(req.query.id, req.body)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }

  if (req.method === "DELETE") {
    await stripe.products
      .del(req.query.id)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
}
