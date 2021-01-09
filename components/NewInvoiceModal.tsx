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

export default function NewInvoiceModal({
  isOpen,
  onClose,
  customerId,
}: {
  isOpen: any;
  onClose: any;
  customerId?: string;
}) {
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

  const handleData = (values) => {
    let { customer, collection_method, days_until_due, description } = values;
    console.log(days_until_due);
    if (collection_method !== "send_invoice") {
      days_until_due = undefined;
    }
    console.log(customer, collection_method, days_until_due, description);
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
      .catch((error) =>
        toast({
          title: error.response.data.type,
          status: "error",
          description: error.response.data.raw.message,
        })
      );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(handleData)}>
            <ModalHeader>Generate Invoice</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={errors.customer}>
                <FormLabel htmlFor="customer">
                  For which customer do you want to generate an invoice?
                </FormLabel>
                {customers.length > 0 ? (
                  <Select
                    name="customer"
                    ref={register({ required: "This is required" })}
                    defaultValue={customerId}
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
                  <option
                    value="charge_automatically"
                    key="charge_automatically"
                  >
                    Charge Automatically
                  </option>
                  <option value="send_invoice" key="send_invoice">
                    Send Invoice
                  </option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Days until due</FormLabel>
                <NumberInput isDisabled={DUDDisabled}>
                  <NumberInputField
                    defaultValue={30}
                    ref={register}
                    name="days_until_due"
                  />
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
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Close
              </Button>
              <Button type="submit" colorScheme="blue">
                Generate
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
