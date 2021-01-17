import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputLeftAddon,
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
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import ErrorHandler from "./ErrorHandler";

export default function BalanceModal({
  customer,
}: {
  customer: Stripe.Customer;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, formState, errors } = useForm();
  const [balance, setBalance] = useState<number>(0);
  const [adjustmentType, setAdjustmentType] = useState("credit");
  const toast = useToast();
  const router = useRouter();

  function onSubmit(values) {
    const { newBalance } = values;

    axios
      .post(`/api/customers/${customer.id}/balance_transactions`, {
        amount:
          adjustmentType === "credit"
            ? -parseInt(newBalance) * 100
            : parseInt(newBalance) * 100,
        currency: "AUD",
      })
      .then(() => {
        toast({ title: "Success", status: "success" });
      })
      .catch((error) => ErrorHandler(error, toast));
  }

  return (
    <>
      <IconButton
        aria-label="add the balance"
        variant="ghost"
        icon={<EditIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Edit Customer Balance</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <StatGroup>
                <Stat>
                  <StatLabel>Starting Balance</StatLabel>
                  <StatNumber>${-customer.balance / 100}</StatNumber>
                  <StatHelpText></StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>New Balance</StatLabel>
                  <StatNumber>
                    $
                    {adjustmentType === "credit"
                      ? -customer.balance / 100 + balance
                      : -customer.balance / 100 - balance}
                  </StatNumber>
                  <StatHelpText></StatHelpText>
                </Stat>
              </StatGroup>
              <FormControl>
                <Select
                  name="adjustment_type"
                  onChange={(e) => setAdjustmentType(e.target.value)}
                  value={adjustmentType}
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="$" />
                  <NumberInput defaultValue={customer.balance}>
                    <NumberInputField
                      ref={register()}
                      //   name={`classes[${index}].amount`}
                      name="newBalance"
                      value={balance}
                      onChange={(e) => {
                        setBalance(parseInt(e.target.value));
                      }}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
