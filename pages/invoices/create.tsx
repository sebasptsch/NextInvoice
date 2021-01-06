import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import Layout from "../../components/Layout";
const stripe = require("stripe")(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN"
);
import Autocomplete from "react-autocomplete";

export default function CreateInvoice({ customers }) {
  const [value, setValue] = useState("");
  // // const [customers, setCustomers] = useState([]);
  // const handleChange = (event) => setValue(event.target.value);

  console.log(customers);

  //   const setCustomerItems()
  //   console.log(customers);
  //   console.log(customers);

  return (
    <Layout>
      <Heading>Create Invoice</Heading>
      <br />
      <Divider />
      <br />
      <Flex>
        <Center>
          <Text>Customer: </Text>
        </Center>
        <Spacer />
        {/* <Input
          value={value}
          onChange={handleChange}
          placeholder={customers.filter((customer) => {
            const matchingCustomers = customer.name.includes(value);
            console.log(matchingCustomers[0]);
            return matchingCustomers[0];
          })}
        /> */}
      </Flex>

      {/* {customers} */}
      {/* {customers
        ?.filter((customer) => customer.name.includes(value))
        .map((filteredName) => {
          console.log(filteredName);
          return <Text key={customers.id}>{filteredName.name}</Text>;
        })} */}
    </Layout>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await stripe.customers.list();
  const customers = await res.data;
  // console.log(await customers);

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      customers,
    },
  };
}
