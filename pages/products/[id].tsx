import Layout from "../../components/Layout";

import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

export default function Products({ product }: { product: Stripe.Product }) {
  // console.log(product);
  return <Layout>{product.name}</Layout>;
}

export async function getStaticProps({ params }) {
  const product = await stripe.products.retrieve(params.id);
  //   console.log(invoice);
  //   const invoice = await res.invoice;
  //   console.log(await stripe.invoices.retrieve("in_1HQXddIK06OmoiJkg9DVgibR"));
  //   console.log(invoice);
  return {
    props: {
      product,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const res = await stripe.products.list();
  const products = await res.data;

  // console.log(allPosts?.map((post) => `/blog/${post.id}`));
  //   console.log(invoices);
  return {
    paths: (await products?.map((product) => `/products/${product.id}`)) || [],
    fallback: false,
  };
}
