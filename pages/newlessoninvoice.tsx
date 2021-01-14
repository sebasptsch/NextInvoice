import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Select,
  Spacer,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { urlObjectKeys } from "next/dist/next-server/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import ErrorHandler from "../components/ErrorHandler";
import Layout from "../components/Layout";

export default function LessonInvoice() {
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>();
  const [progress, setProgress] = useState<number>(0);
  const [DUDDisabled, setDUDDisabled] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { handleSubmit, errors, register, formState } = useForm();
  useEffect(() => {
    axios
      .get(`/api/customers`)
      .then((response) => {
        setCustomers(response.data.data);
      })
      .catch((error) => ErrorHandler(error, toast));
  }, []);

  function onSubmit(values) {
    let { collection_method, days_until_due, weeks_in_term } = values;
    if (collection_method !== "send_invoice") {
      days_until_due = undefined;
    }

    const filteredcustomers = values.checkedcustomers?.filter(
      (customer) => customer.checked
    );

    async function newFunction(parsedClasses: any, customer) {
      return Promise.all(
        parsedClasses.map(
          async (artclass) =>
            await axios
              .post(`/api/invoiceitems`, {
                customer: customer.id,
                price: artclass.priceid,
                quantity: artclass.amount * weeks_in_term,
              })
              .catch((error) => ErrorHandler(error, toast))
        )
      );
    }

    return Promise.all(
      filteredcustomers?.map(async (customer, index) => {
        const parsedCustomer = JSON.parse(customer.customer);
        const parsedClasses = JSON.parse(parsedCustomer.metadata.classes);

        return await new Promise<void>((resolve) =>
          newFunction(parsedClasses, parsedCustomer).then(() => {
            axios
              .post(`/api/invoices`, {
                customer: parsedCustomer.id,
                collection_method,
                days_until_due,
              })
              .then(() => {
                setProgress((index + 1) / filteredcustomers?.length);
                // console.log((index + 1) / filteredcustomers?.length);
                resolve();
              })
              .catch((error) => ErrorHandler(error, toast));
          })
        );
      })
    ).then(() => router.push(`/invoices?status=draft`));
  }
  return (
    <Layout>
      <Head>
        <title>Customers to be billed for classes</title>
      </Head>
      <Heading>Customers to be billed for classes</Heading>
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>Collection Method</FormLabel>
          <Select
            defaultValue={"send_invoice"}
            name="collection_method"
            ref={register}
            onChange={(e) => {
              let chargePrev;
              if (e.target.value !== chargePrev) {
                setDUDDisabled(e.target.value === "charge_automatically");
                chargePrev = e.target.value;
              }
            }}
          >
            <option value="charge_automatically" key="charge_automatically">
              Charge Automatically
            </option>
            <option value="send_invoice" key="send_invoice">
              Send Invoice
            </option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Days until due</FormLabel>
          <NumberInput isDisabled={DUDDisabled} defaultValue={30}>
            <NumberInputField ref={register()} name="days_until_due" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Weeks in current term</FormLabel>
          <NumberInput defaultValue={10}>
            <NumberInputField ref={register()} name="weeks_in_term" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Customers</FormLabel>
          <Box borderWidth="1px" borderRadius="10px" overflow="hidden">
            <Progress value={progress * 100} />
            <Stack spacing={2}>
              {customers?.map((customer, index) => (
                <div key={customer.id}>
                  <Checkbox
                    key={customer.id}
                    name={`checkedcustomers[${index}].checked`}
                    ref={register}
                    m={4}
                    defaultChecked={JSON.parse(customer.metadata.classes).length > 0}
                  >
                    {customer.email}
                  </Checkbox>
                  <input
                    type="hidden"
                    ref={register}
                    name={`checkedcustomers[${index}].customer`}
                    value={JSON.stringify(customer)}
                  />
                </div>
              ))}
            </Stack>
          </Box>
        </FormControl>
        <br />

        <Button
          type="submit"
          textAlign="center"
          w="100%"
          isLoading={formState.isSubmitting}
        >
          Send Invoices
        </Button>
      </form>
    </Layout>
  );
}
