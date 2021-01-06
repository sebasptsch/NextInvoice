const stripe = require("stripe")(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN"
);

export default function CustomerPage({ customer }) {
  console.log(customer);
  return customer.name;
}

export async function getStaticProps({ params }) {
  const customer = await stripe.customers.retrieve(params.id);
  //   console.log(invoice);
  //   const invoice = await res.invoice;
  //   console.log(await stripe.invoices.retrieve("in_1HQXddIK06OmoiJkg9DVgibR"));
  //   console.log(invoice);
  return {
    props: {
      customer,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const res = await stripe.customers.list();
  const customers = await res.data;

  // console.log(allPosts?.map((post) => `/blog/${post.id}`));
  //   console.log(invoices);
  return {
    paths:
      (await customers?.map((customer) => `/customers/${customer.id}`)) || [],
    fallback: false,
  };
}
