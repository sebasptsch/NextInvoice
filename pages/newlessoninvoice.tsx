import {
  Box,
  Checkbox,
  Flex,
  Heading,
  Spacer,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import ErrorHandler from "../components/ErrorHandler";
import Layout from "../components/Layout";

export default function LessonInvoice() {
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>();
  const toast = useToast();
  useEffect(() => {
    axios
      .get(`/api/customers`)
      .then((response) => {
        setCustomers(response.data.data);
      })
      .catch((error) => ErrorHandler(error, toast));
  });

  const [checkedItems, setCheckedItems] = useState([]);

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  return (
    <Layout>
      <Stack spacing={5}>
        <Heading>Customers to be billed for classes</Heading>
        <br />
        <Checkbox
          defaultChecked={false}
          isChecked={allChecked}
          isIndeterminate={isIndeterminate}
          onChange={(e) =>
            setCheckedItems(Array.from(checkedItems, () => true))
          }
        >
          All Customers
        </Checkbox>
        {customers?.map((customer, index) => (
          <Box key={customer.id}>
            <Checkbox
              defaultChecked={false}
              isChecked={checkedItems[index]}
              onChange={(e) =>
                setCheckedItems([e.target.checked, checkedItems[index]])
              }
            >
              {customer.name}
            </Checkbox>
          </Box>
        ))}
      </Stack>
    </Layout>
  );
}
