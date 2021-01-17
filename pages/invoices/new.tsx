import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import ErrorHandler from "../../components/ErrorHandler";
import { useCustomers, usePrices } from "../../helpers/helpers";

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps(context) {
  const customers = await stripe.customers.list({ limit: 100 });
  const prices = await stripe.prices.list();

  return {
    props: {
      prices,
      customers,
    },
  };
}

export default function NewInvoice(props) {
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const [DUDDisabled, setDUDDisabled] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const { prices } = usePrices(undefined, props.prices);
  const { customers } = useCustomers(100, props.customers);
  const [customer, setCustomer] = useState(customers[0].id);
  const [invoiceItems, setInvoiceItems] = useState<Array<any>>([]);
  const handleInvoiceData = (values) => {
    let { collection_method, days_until_due, description } = values;
    if (collection_method !== "send_invoice") {
      days_until_due = undefined;
    }

    function addItems() {
      return Promise.all(
        invoiceItems.map(async (item) => {
          let { quantity, price } = item;
          return await axios
            .post(`/api/invoiceitems`, {
              customer,
              price: price.id,
              quantity: quantity,
            })
            .catch((error) => ErrorHandler(error, toast));
        })
      );
    }
    const tax_rates =
      process.env.NODE_ENV === "production"
        ? { default_tax_rates: ["txr_1I9gWSIK06OmoiJke5vnXGgL"] }
        : null;
    return new Promise<void>((resolve) =>
      addItems().then(() => {
        axios
          .post(`/api/invoices`, {
            customer,
            collection_method,
            days_until_due,
            auto_advance: true,
            ...tax_rates,
          })
          .then((response) => {
            // console.log((index + 1) / filteredcustomers?.length);
            resolve();
            router.push(`/invoices/${response.data.id}`);
          })
          .catch((error) => ErrorHandler(error, toast));
      })
    );
  };
  const handleLineData = (values) => {
    const { quantity, price } = values.invoiceitem;
    const parsedPrice = JSON.parse(price);
    setInvoiceItems(invoiceItems.concat([{ quantity, price: parsedPrice }]));
  };

  return (
    <>
      <FormControl>
        <FormLabel>Select a customer</FormLabel>
        <Select
          name="customer"
          defaultValue={router.query.customer}
          onChange={(e) => setCustomer(e.target.value)}
          value={customer}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name?.length > 0 ? customer?.name : customer?.email}
            </option>
          ))}
        </Select>
      </FormControl>

      <form onSubmit={handleSubmit(handleLineData)}>
        <FormControl>
          <FormLabel>Invoice items</FormLabel>
          <Stack spacing={5} borderRadius="10px" borderWidth="1px" p={1}>
            {invoiceItems.map((item, index) => (
              <Box
                borderWidth="1px"
                borderRadius="10px"
                p="0.5em"
                // m="1em"
                // key={item?.id}
              >
                <Flex>
                  <Center>
                    <Badge marginRight={2} colorScheme="blue">
                      {item.quantity}
                    </Badge>
                    {" " + item.price.nickname?.toString()}
                  </Center>
                  <Spacer />
                  <Center>${item.price.unit_amount / 100}</Center>
                  <IconButton
                    aria-label="delete row"
                    icon={<DeleteIcon />}
                    onClick={() => {
                      setInvoiceItems(
                        invoiceItems
                          .slice(0, index)
                          .concat(
                            invoiceItems.slice(index + 1, invoiceItems.length)
                          )
                      );
                    }}
                  />
                </Flex>
              </Box>
            ))}
          </Stack>
        </FormControl>
        <br />
        <Box borderWidth="1px" borderRadius="0.375rem">
          <Flex>
            <NumberInput defaultValue={"1"} width={100} borderWidth={0}>
              <NumberInputField
                ref={register()}
                name="invoiceitem.quantity"
                borderWidth={0}
              />
              <NumberInputStepper></NumberInputStepper>
            </NumberInput>

            <Select
              ref={register}
              name={`invoiceitem.price`}
              // as={Input}
              borderWidth={0}
              textAlign="center"
            >
              {prices
                .filter((price) => price.active)
                .map((price) => (
                  <option value={JSON.stringify(price)} key={price.id}>
                    {price.nickname}
                  </option>
                ))}
            </Select>

            <IconButton
              aria-label="add invoice item"
              icon={<AddIcon />}
              type="submit"
              variant="ghost"
            />
          </Flex>
        </Box>
      </form>
      <br />
      <form onSubmit={handleSubmit(handleInvoiceData)}>
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
        <Box></Box>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea ref={register} name="description" />
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={formState.isSubmitting}
        >
          Generate
        </Button>
      </form>
    </>
  );
}
