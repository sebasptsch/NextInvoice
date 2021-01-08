import {
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  Input,
  SkeletonText,
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
  const [customersLoading, setCustomersLoading] = useState(true);
  useEffect(() => {
    setCustomersLoading(true);
    setCustomers([]);
    axios({ url: `/api/customers`, method: "GET" }).then((customers) => {
      setCustomersLoading(false);
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
      {customersLoading ? (
        <Box
          borderWidth="1px"
          borderRadius="10px"
          p="1em"
          m="1em"
          height="82px"
        >
          <SkeletonText height="100%" />
        </Box>
      ) : null}
    </Layout>
  );
}
