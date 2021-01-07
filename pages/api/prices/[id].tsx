import Stripe from "stripe";
import type { NextApiRequest } from "next";
import { getSession } from "next-auth/client";

const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(403).json({
      message: "Please Login using valid credentials",
    });
  }
  if (req.method === "GET") {
    // console.log("hello");
    await stripe.prices
      .retrieve(req.query.id)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
  if (req.method === "POST") {
    await stripe.prices
      .update(req.query.id, req.body)
      .then((value) => res.status(200).json(value))
      .catch((error) => res.status(500).json(error));
  }
}
