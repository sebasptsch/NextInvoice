import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
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
  Spacer,
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
import { array } from "yup/lib/locale";
import ErrorHandler from "../../components/ErrorHandler";
import Layout from "../../components/Layout";

export default function NewInvoice() {
  // Hooks
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const [DUDDisabled, setDUDDisabled] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [invoiceItems, setInvoiceItems] = useState<Array<any>>([]);
  const [customer, setCustomer] = useState<string>();
  const [prices, setPrices] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/customers`)
      .then((response) => {
        setCustomers(response.data.data);
        if (!customer) {
          setCustomer(response.data.data[0].id);
        }
      })
      .catch((error) => ErrorHandler(error, toast));
    axios
      .get(`/api/prices`)
      .then((response) => setPrices(response.data.data))
      .catch((error) => ErrorHandler(error, toast));
  }, []);

  // Component Functions
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

    return new Promise<void>((resolve) =>
      addItems().then(() => {
        axios
          .post(`/api/invoices`, {
            customer,
            collection_method,
            days_until_due,
          })
          .then((response) => {
            // console.log((index + 1) / filteredcustomers?.length);
            resolve();
            router.push(`/inoices/${response.data.id}`);
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
    <Layout>
      <Select
        name="customer"
        defaultValue={router.query.customer}
        onChange={(e) => setCustomer(e.target.value)}
        value={customer}
      >
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </Select>
      <form onSubmit={handleSubmit(handleLineData)}>
        {invoiceItems.map((item, index) => (
          <Box m={4} borderWidth="1px" borderRadius="10px" p={2}>
            <Flex>
              <Badge>{item.quantity}</Badge>
              {item.price.nickname}
              <Spacer />
              <IconButton
                aria-label="delete row"
                icon={<DeleteIcon />}
                onClick={() => {
                  // if (invoiceItems.length === 1) {
                  //   setInvoiceItems([]);
                  // } else {
                  setInvoiceItems(
                    invoiceItems
                      .slice(0, index)
                      .concat(
                        invoiceItems.slice(index + 1, invoiceItems.length)
                      )
                  );
                  // }
                }}
              />
            </Flex>
          </Box>
        ))}
        <Flex>
          <NumberInput defaultValue={"1"} width={100}>
            <NumberInputField ref={register()} name="invoiceitem.quantity" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select ref={register} name={`invoiceitem.price`}>
            {prices.map((price) => (
              <option value={JSON.stringify(price)} key={price.id}>
                {price.nickname}
              </option>
            ))}
          </Select>
          <IconButton
            aria-label="add invoice item"
            icon={<AddIcon />}
            type="submit"
          />
        </Flex>
      </form>
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
    </Layout>
  );
}
