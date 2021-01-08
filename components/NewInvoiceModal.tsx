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
  Select,
  Spinner,
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
  const { handleSubmit, errors, register, formState } = useForm();
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
    const { customer } = values;
    axios
      .post(`/api/invoices`, {
        customer,
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
            <ModalHeader>Create Invoice</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={errors.customer}>
                <FormLabel htmlFor="customer">
                  For which customer do you want to create an invoice?
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
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Close
              </Button>
              <Button type="submit" colorScheme="blue">
                Create
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
