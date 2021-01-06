import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    res.status(403).json({
      message: "Please Login using valid credentials",
    });
  }
  if (req.method == "POST") {
    await stripe.customers
      .create(req.body)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
  if (req.method == "GET") {
    await stripe.customers
      .list(req.body)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
}
