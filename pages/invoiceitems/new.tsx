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
import { useCustomers, usePrices } from "../../helpers/helpers";

export default function NewInvoiceItem() {
  // Hooks
  // const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);
  const { customers } = useCustomers();
  const { prices } = usePrices();
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const toast = useToast();
  const router = useRouter();
  if (!router.query.id) return null;

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
          {customers?.length > 0 ? (
            <Select
              name="customer"
              defaultValue={router.query.customer}
              ref={register}
            >
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name?.length > 0 ? customer?.name : customer?.email}
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
          {prices?.length > 0 ? (
            <Select
              name="price"
              ref={register({ required: "This is required" })}
              defaultValue={router.query.price}
            >
              {prices
                ?.filter((price) => price.active)
                ?.map((price) => (
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
