import Layout from "../../components/Layout";

import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

export default function CustomerPage({
  customer,
}: {
  customer: Stripe.Customer;
}) {
  //   console.log(customer);
  return <Layout>{customer?.name}</Layout>;
}

export async function getServerSideProps({ params }) {
  const customer = await stripe.customers.retrieve(params.id);
  return {
    props: {
      customer,
    },
  };
}

// export async function getStaticPaths() {
//   const res = await stripe.customers.list();
//   const customers = await res.data;

//   // console.log(allPosts?.map((post) => `/blog/${post.id}`));
//   //   console.log(invoices);
//   return {
//     paths:
//       (await customers?.map((customer) => `/customers/${customer?.id}`)) || [],
//     fallback: true,
//   };
// }
