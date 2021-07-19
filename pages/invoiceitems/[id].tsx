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
import { useSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import ErrorHandler from "../../components/ErrorHandler";
import Layout from "../../components/Layout";
import { useInvoiceItem, usePrices } from "../../extras/resourceHooks";

export default function NewInvoiceItem() {
  // Hooks
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();
  const router = useRouter();
  const [session, loading] = useSession();

  const { prices } = usePrices();
  const { invoiceItem, mutate } = useInvoiceItem(router.query.id);

  // Component Functions
  const handleData = (values) => {
    let { price, quantity } = values;
    mutate({ ...invoiceItem, price, quantity }, false);
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

  if (typeof window !== "undefined" && loading) return null;

  if (session) {
    return (
      <Layout>
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
                defaultValue={invoiceItem?.price.id}
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
            <NumberInput defaultValue={invoiceItem?.quantity}>
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
  return <p>Access Denied</p>;
}
