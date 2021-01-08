import {
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import Layout from "../../components/Layout";
import Stripe from "stripe";
import axios from "axios";
import CustomerComponent from "../../components/Customer";
console.log(process.env.STRIPE_KEY);
const stripe = new Stripe(`${process.env.STRIPE_KEY}`, {
  apiVersion: "2020-08-27",
});

export default function Customers({
  customers,
}: {
  customers: Array<Stripe.Customer>;
}) {
  // console.log(invoices);
  const [value, setValue] = useState("");
  const handleChange = (event) => setValue(event.target.value);
  return (
    <Layout>
      <Flex>
        <Heading size="xl">Customers</Heading> <Spacer />
        <Center>
          <Input
            placeholder="Search Customers"
            value={value}
            onChange={handleChange}
          />
        </Center>
      </Flex>

      {customers
        .filter((customer) =>
          customer.name?.toLowerCase().includes(value.toLowerCase())
        )
        .map((customer) => (
          <CustomerComponent customer={customer} />
        ))}
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await stripe.customers.list();
  const customers = await res.data;
  //   console.log(customers);

  return {
    props: {
      customers,
    },
  };
}
