import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import ErrorHandler from "../../components/ErrorHandler";
import Layout from "../../components/Layout";
import Head from "next/head";

export default function NewInvoiceItem({
  invoiceItem,
}: {
  invoiceItem: Stripe.InvoiceItem;
}) {
  // Hooks
  const [prices, setPrices] = useState<Array<Stripe.Price>>([]);
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`/api/prices`)
      .then((response) => {
        setPrices(response.data.data);
      })
      .catch((error) => ErrorHandler(error, toast));
  }, []);

  // Component Functions
  const handleData = (values) => {
    let { price, quantity } = values;
    return axios
      .post(`/api/invoiceitems/${invoiceItem.id}`, {
        price,
        quantity,
      })
      .then((response) => {
        // console.log(response.data);
        // router.push(`/customer/[id]`, `/customers/${response.data.customer}`);
        router.reload();
        toast({ title: "Success" });
      })
      .catch((error) => ErrorHandler(error, toast));
  };

  return (
    <Layout>
      <Head>Edit Invoice Item</Head>
      <Heading>Edit Invoice Item</Heading>
      <br />
      <Divider />
      <br />
      <form onSubmit={handleSubmit(handleData)}>
        <FormControl isInvalid={errors.price}>
          <FormLabel htmlFor="customer">What price should it use?</FormLabel>
          {prices.length > 0 ? (
            <Select
              name="price"
              ref={register({ required: "This is required" })}
              defaultValue={invoiceItem.price.id}
            >
              {prices
                .filter((price) => price.active)
                .map((price) => (
                  <option key={price.id} value={price.id}>
                    {price.nickname}
                  </option>
                ))}
            </Select>
          ) : null}
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Number of Items</FormLabel>
          <NumberInput defaultValue={invoiceItem.quantity}>
            <NumberInputField ref={register()} name="quantity" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <br />
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={formState.isSubmitting}
        >
          Save
        </Button>
      </form>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const invoiceItem = await stripe.invoiceItems.retrieve(params.id);
  return {
    props: {
      invoiceItem,
    },
  };
}
