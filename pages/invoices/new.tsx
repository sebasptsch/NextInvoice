import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import ErrorHandler from "../../components/ErrorHandler";
import Layout from "../../components/Layout";

export default function NewInvoice() {
  // Hooks
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const [DUDDisabled, setDUDDisabled] = useState(false);
  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`/api/customers`)
      .then((response) => {
        setCustomers(response.data.data);
      })
      .catch((error) =>
        toast({
          title: error.response.data.type,
          status: "error",
          description: error.response.data.raw.message,
        })
      );
  }, []);

  // Component Functions
  const handleData = (values) => {
    let { customer, collection_method, days_until_due, description } = values;
    if (collection_method !== "send_invoice") {
      days_until_due = undefined;
    }
    axios
      .post(`/api/invoices`, {
        customer,
        collection_method,
        days_until_due,
        description,
      })
      .then((response) =>
        router.push(`/invoices/[id]`, `/invoices/${response.data.id}`)
      )
      .catch((error) => ErrorHandler(error, toast));
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(handleData)}>
        <FormControl isInvalid={errors.customer}>
          <FormLabel htmlFor="customer">
            For which customer do you want to generate an invoice?
          </FormLabel>
          {customers.length > 0 ? (
            <Select
              name="customer"
              ref={register({ required: "This is required" })}
              defaultValue={router.query.customer}
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </Select>
          ) : null}
          <FormErrorMessage>{errors.customer?.message}</FormErrorMessage>
        </FormControl>
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
          <FormLabel>Description</FormLabel>
          <Textarea ref={register} name="description" />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Generate
        </Button>
      </form>
    </Layout>
  );
}
