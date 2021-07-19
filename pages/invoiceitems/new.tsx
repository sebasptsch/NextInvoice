import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import ErrorHandler from "../../components/ErrorHandler";
import Layout from "../../components/Layout";
import { useCustomers, usePrices } from "../../extras/resourceHooks";

export default function NewInvoiceItem() {
  const { prices } = usePrices(undefined);
  const { customers } = useCustomers(100);
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const toast = useToast();
  const router = useRouter();
  const [session, loading] = useSession();

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

  if (session) {
    return (
      <Layout>
        <form onSubmit={handleSubmit(handleData)}>
          <FormControl isInvalid={errors.customer}>
            <FormLabel htmlFor="customer">
              Which Customer do you want to add an invoice item to?
            </FormLabel>
            {customers?.length > 0 ? (
              <Input
                name="customer"
                defaultValue={router.query.customer}
                ref={register}
                list="customers"
              />
            ) : null}
            <datalist id="customers">
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name?.length > 0 ? customer?.name : customer?.email}
                </option>
              ))}
            </datalist>
            <FormErrorMessage>{errors.customer?.message}</FormErrorMessage>
          </FormControl>
          <FormControl></FormControl>
          <FormControl isInvalid={errors.price} isDisabled={false}>
            <FormLabel htmlFor="price">
              Which Price / Product Would you like to add?
            </FormLabel>

            <Input
              name="price"
              ref={register({ required: "This is required" })}
              defaultValue={router.query.price}
              list="prices"
            />
            <datalist id="prices">
              {prices
                ?.filter((price) => price.active)
                ?.map((price) => (
                  <option key={price.id} value={price.id}>
                    {price.nickname}
                  </option>
                ))}
            </datalist>

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
  return <p>Access Denied</p>;
}
