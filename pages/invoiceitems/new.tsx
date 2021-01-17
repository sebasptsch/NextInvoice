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
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import useSWR from "swr";
import ErrorHandler from "../../components/ErrorHandler";
import { listFetcher } from "../../helpers/helpers";
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps(context) {
  const customers = await stripe.customers.list({ limit: 100 });

  const prices = await stripe.prices.list();

  return {
    props: {
      customers: customers.data,
      prices: prices.data,
    },
  };
}

export default function NewInvoiceItem(props) {
  const { data: prices } = useSWR(`/api/prices`, listFetcher, {
    initialData: props.prices,
  });
  const { data: customers } = useSWR(`/api/customers`, listFetcher, {
    initialData: props.customers,
  });
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const toast = useToast();
  const router = useRouter();

  // Component Functions
  const handleData = (values) => {
    let { customer, price, quantity } = values;
    return axios
      .post(`/api/invoiceitems`, {
        customer,
        price,
        quantity,
      })
      .then((response) => router.push(`/invoiceitems/${response.data.id}`))
      .catch((error) => ErrorHandler(error, toast));
  };

  return (
    <>
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
    </>
  );
}
