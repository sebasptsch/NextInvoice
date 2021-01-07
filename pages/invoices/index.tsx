import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Select,
  SkeletonText,
  Spacer,
  Text,
} from "@chakra-ui/react";

import Layout from "../../components/Layout";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

import InvoiceComponent from "../../components/Invoice";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, isLoading] = useState(false);
  const [value, setValue] = useState("open");
  useEffect(() => {
    isLoading(true);
    setInvoices([]);
    axios
      .get("/api/invoices", { params: { status: value } })
      .then((response) => {
        setInvoices(
          response.data.data
            .filter((invoice) => invoice.status === value || value === "all")
            .sort((invoice) => invoice.due_date)
        );
        isLoading(false);
      });
  }, [value]);
  const handleStatus = (e) => {
    setValue(e.target.value);
  };
  return (
    <Layout>
      <Flex>
        <Heading marginTop="1em" marginBottom="0.5em" size="lg">
          Invoices
        </Heading>
        <Spacer />
        <Center>
          <Select value={value} onChange={handleStatus}>
            {/* <option value="all">All</option> */}
            <option value="draft" key="draft">
              Draft
            </option>
            <option value="open" key="open">
              Open
            </option>
            <option value="paid" key="paid">
              Paid
            </option>
            <option value="uncollectible" key="uncollectible">
              Uncollectible
            </option>
            <option value="void" key="void">
              Void
            </option>
          </Select>
        </Center>
      </Flex>

      <Divider marginBottom={2} />
      {loading ? (
        <Box
          borderWidth="1px"
          borderRadius="10px"
          p="1em"
          m="1em"
          height="82px"
        >
          <SkeletonText height="100%" />
        </Box>
      ) : null}
      {invoices.length != 0 ? (
        invoices.map((invoice) => (
          <>
            <InvoiceComponent invoice={invoice} key={invoice.id} />
          </>
        ))
      ) : loading ? null : (
        <Text>No invoices here.</Text>
      )}
    </Layout>
  );
}
