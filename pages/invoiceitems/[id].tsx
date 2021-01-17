import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import useSWR from "swr";
import ErrorHandler from "../../components/ErrorHandler";
import { fetcher, listFetcher } from "../../helpers/helpers";

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps(context) {
  const { id } = context.params;
  const invoiceItem = await stripe.invoiceItems.retrieve(id);
  const prices = await stripe.prices.list();

  return {
    props: {
      prices: prices.data,
      invoiceItem,
    },
  };
}

export default function NewInvoiceItem(props) {
  // Hooks
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();
  const router = useRouter();
  const { data: prices } = useSWR(`/api/prices`, listFetcher, {
    initialData: props.prices,
  });
  const { data: invoiceItem, mutate } = useSWR(
    `/api/invoiceitems/${router.query.id}`,
    fetcher,
    {
      initialData: props.invoiceItem,
    }
  );

  // Component Functions
  const handleData = (values) => {
    let { price, quantity } = values;
    return axios
      .post(`/api/invoiceitems/${router.query.id}`, {
        price,
        quantity,
      })
      .then((response) => {
        // console.log(response.data);
        // router.push(`/customer/[id]`, `/customers/${response.data.customer}`);
        toast({ title: "Success" });
        mutate();
      })
      .catch((error) => ErrorHandler(error, toast));
  };

  return (
    <>
      <Head>
        <title>Edit Invoice Item</title>
      </Head>
      <Heading>Edit Invoice Item</Heading>
      <br />
      <Divider />
      <br />
      <form onSubmit={handleSubmit(handleData)}>
        <FormControl isInvalid={errors.price}>
          <FormLabel htmlFor="customer">What price should it use?</FormLabel>
          {prices?.length > 0 ? (
            <Select
              name="price"
              ref={register({ required: "This is required" })}
              defaultValue={invoiceItem.price.id}
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
    </>
  );
}
