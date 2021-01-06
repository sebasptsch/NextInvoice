import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

export default async function customerIdHandler({ query: { id } }, req, res) {
  console.log(req.method);
  if (req === "GET") {
    console.log("hello");
    await stripe.customers
      .retrieve(id)
      .then((value) => res.status(200).json(value));
  }
  if (req.method === "POST") {
    await stripe.customers
      .update(id, req.body)
      .then((value) => res.status(200).json(value));
  }

  if (req.method === "DELETE") {
    await stripe.customers.del(id).then((value) => res.status(200).json(value));
  }
}
