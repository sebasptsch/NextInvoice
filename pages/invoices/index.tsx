import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Select,
  SkeletonText,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";

import Layout from "../../components/Layout";
import Stripe from "stripe";

import InvoiceComponent from "../../components/Invoice";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import InvoiceList from "../../components/InvoiceList";
import ErrorHandler from "../../components/ErrorHandler";

export default function Invoices() {
  // Hooks
  const [invoices, setInvoices] = useState([]);
  const [loading, isLoading] = useState(false);
  const [value, setValue] = useState("open");
  const toast = useToast();
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
      })
      .catch((error) => ErrorHandler(error, toast));
  }, [value]);

  return (
    <Layout>
      <Head>
        <title>Invoices</title>
      </Head>
      <InvoiceList />
    </Layout>
  );
}
