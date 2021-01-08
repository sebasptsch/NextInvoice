import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
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
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Customers() {
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const router = useRouter();
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
      <Head>
        <title>Customers</title>
      </Head>
      <Flex>
        <Heading size="lg">Customers</Heading>
        <Spacer />
        <IconButton
          aria-label="Add Customer"
          icon={<AddIcon />}
          onClick={() => {
            router.push(`/customers/new`);
          }}
        />
      </Flex>

      <Center marginTop="1em">
        <Input placeholder="Search" value={value} onChange={handleChange} />
      </Center>
      <br />
      <Divider />

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
