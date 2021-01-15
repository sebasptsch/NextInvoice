import {
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import Layout from "../../components/Layout";
import CustomerComponent from "../../components/Customer";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Head from "next/head";
import { useCustomers } from "../../helpers/helpers";

export default function Customers() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { customers, isLoading } = useCustomers();
  const handleChange = (event) => setValue(event.target.value);

  if (isLoading) return <Spinner />;
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
            router.push(`/customers/new`, `/customers/new`);
          }}
        />
      </Flex>

      <Center marginTop="1em">
        <Input placeholder="Search" value={value} onChange={handleChange} />
      </Center>
      <br />
      <Divider />

      {customers
        ?.filter(
          (customer) =>
            customer.email?.toLowerCase().includes(value.toLowerCase()) ||
            customer.name?.toLowerCase().includes(value.toLowerCase()) ||
            JSON.parse(customer.metadata.students).some((student) => {
              const studentName = student.toLowerCase();
              return studentName.includes(value.toLowerCase());
            })
        )
        ?.map((customer) => (
          <CustomerComponent customer={customer} key={customer.id} />
        ))}
    </Layout>
  );
}
