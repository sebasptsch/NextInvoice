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
import { Customer } from "../../interfaces/Customer";
const stripe = require("stripe")(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN"
);

export default function Customers({
  customers,
}: {
  customers: Array<Customer>;
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
          customer.name.toLowerCase().includes(value.toLowerCase())
        )
        .map((customer) => (
          <>
            <Box borderWidth="1px" borderRadius="10px" p="1em" m="1em">
              <Flex>
                <Box as="a" href={"/customers/" + customer.id}>
                  {customer.name}
                </Box>
                <Spacer />
                <Box></Box>
              </Flex>
            </Box>
          </>
        ))}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await stripe.customers.list({});
  const customers = await res.data;
  //   console.log(customers);

  return {
    props: {
      customers,
    },
    revalidate: 1,
  };
}
