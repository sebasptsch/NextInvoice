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
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
const stripe = require("stripe")(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN"
);

import Select from "react-select";
import { useTheme } from "@emotion/react";
// var ReactSelect = require("react-select");

export default function CreateInvoice({ customers, customerOptions }) {
  // console.log(customerOptions);

  return (
    <Layout>
      <Heading>Create Invoice</Heading>
      <br />
      <Divider />
      <br />
      <Select options={customerOptions} />
    </Layout>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await stripe.customers.list();
  const customers = await res.data;
  // console.log(await customers);

  const customerOptions = customers.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      customers,
      customerOptions,
    },
  };
}
