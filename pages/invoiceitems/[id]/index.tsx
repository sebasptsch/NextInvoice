import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import ErrorHandler from "../../../components/ErrorHandler";
import Layout from "../../../components/Layout";

export default function NewInvoiceItem({
  invoiceItem,
}: {
  invoiceItem: Stripe.InvoiceItem;
}) {
  // Hooks
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);
  const [prices, setPrices] = useState<Array<Stripe.Price>>([]);
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const [DUDDisabled, setDUDDisabled] = useState(false);
  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`/api/customers`)
      .then((response) => {
        setCustomers(response.data.data);
      })
      .catch((error) => ErrorHandler(error, toast));
    axios
      .get(`/api/prices`)
      .then((response) => {
        setPrices(response.data.data);
      })
      .catch((error) => ErrorHandler(error, toast));
  }, []);

  // Component Functions
  const handleData = (values) => {
    let { customer, price, quantity } = values;
    axios
      .post(`/api/invoiceitems`, {
        customer,
        price,
        quantity,
      })
      .then((response) =>
        router.push(`/customer/[id]`, `/customer/${response.data.customer.id}`)
      )
      .catch((error) => ErrorHandler(error, toast));
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(handleData)}>
        <FormControl isInvalid={errors.customer}>
          <FormLabel htmlFor="customer">
            Which Customer is this invoice item attached to?
          </FormLabel>
          {customers.length > 0 ? (
            <Select
              name="customer"
              ref={register({ required: "This is required" })}
              defaultValue={invoiceItem.customer.toString()}
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </Select>
          ) : null}
          <FormErrorMessage>{errors.customer?.message}</FormErrorMessage>
        </FormControl>
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

        <Button type="submit" colorScheme="blue">
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
