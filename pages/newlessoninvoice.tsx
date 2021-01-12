import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Progress,
  Spacer,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { urlObjectKeys } from "next/dist/next-server/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import ErrorHandler from "../components/ErrorHandler";
import Layout from "../components/Layout";

export default function LessonInvoice() {
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>();
  const [progress, setProgress] = useState<number>(0);
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
    const filteredcustomers = values.checkedcustomers?.filter(
      (customer) => customer.checked
    );

    async function newFunction(parsedClasses: any, customer) {
      return Promise.all(
        parsedClasses.map(
          async (artclass) =>
            await axios.post(`/api/invoiceitems`, {
              customer: customer.id,
              price: artclass.priceid,
              quantity: artclass.amount,
            })
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
              })
              .then(() => {
                setProgress((index + 1) / filteredcustomers?.length);
                // console.log((index + 1) / filteredcustomers?.length);
                resolve();
              });
          })
        );
      })
    ).then(() => router.push(`/invoices?status=draft`));
  }
  return (
    <Layout>
      <Heading>Customers to be billed for classes</Heading>
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box borderWidth="1px" borderRadius="10px">
          <Stack spacing={2}>
            {customers?.map((customer, index) => (
              <div key={customer.id}>
                <Checkbox
                  key={customer.id}
                  name={`checkedcustomers[${index}].checked`}
                  ref={register}
                  m={4}
                  defaultChecked={true}
                >
                  {customer.name}
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
        <br />
        <Progress value={progress * 100} />
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
