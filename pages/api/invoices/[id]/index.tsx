import Stripe from "stripe";
import type { NextApiRequest } from "next";

const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);
import { getSession } from "next-auth/client";
export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(403).json({
      message: "Please Login using valid credentials",
    });
  }
  if (req.method === "GET") {
    await stripe.invoices
      .retrieve(req.query.id)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
  if (req.method === "POST") {
    await stripe.invoices
      .update(req.query.id, req.body)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }

  if (req.method === "DELETE") {
    await stripe.invoices
      .del(req.query.id)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
}
