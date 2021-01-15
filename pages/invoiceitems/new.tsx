import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import ErrorHandler from "../../components/ErrorHandler";
import Layout from "../../components/Layout";

export default function NewInvoiceItem() {
  // Hooks
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);
  const [prices, setPrices] = useState<Array<Stripe.Price>>([]);
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`/api/customers`, { params: { limit: 100 } })
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

    return axios
      .post(`/api/invoiceitems`, {
        customer,
        price,
        quantity,
      })
      .then((response) => router.back())
      .catch((error) => ErrorHandler(error, toast));
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(handleData)}>
        <FormControl isInvalid={errors.customer}>
          <FormLabel htmlFor="customer">
            Which Customer do you want to add an invoice item to?
          </FormLabel>
          {customers.length > 0 ? (
            <Select
              name="customer"
              defaultValue={router.query.customer}
              ref={register}
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.email}
                </option>
              ))}
            </Select>
          ) : null}
          <FormErrorMessage>{errors.customer?.message}</FormErrorMessage>
        </FormControl>
        <FormControl></FormControl>
        <FormControl isInvalid={errors.price} isDisabled={false}>
          <FormLabel htmlFor="price">
            Which Price / Product Would you like to add?
          </FormLabel>
          {prices.length > 0 ? (
            <Select
              name="price"
              ref={register({ required: "This is required" })}
              defaultValue={router.query.price}
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
          <NumberInput defaultValue={"1"}>
            <NumberInputField ref={register()} name="quantity" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <br />
        <Button type="submit" w="100%" isLoading={formState.isSubmitting}>
          Add
        </Button>
      </form>
    </Layout>
  );
}
