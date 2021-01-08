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
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Stripe from "stripe";
import CustomerComponent from "../../components/Customer";
import axios from "axios";

export default function Customers() {
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);
  useEffect(() => {
    axios({ url: `/api/customers`, method: "GET" }).then((customers) => {
      console.log(customers.data.data);
      setCustomers(customers.data.data);
    });
  }, []);
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
          <CustomerComponent customer={customer} key={customer.id} />
        ))}
    </Layout>
  );
}
