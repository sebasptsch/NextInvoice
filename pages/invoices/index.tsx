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
} from "@chakra-ui/react";

import Layout from "../../components/Layout";
import Stripe from "stripe";

import InvoiceComponent from "../../components/Invoice";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import InvoiceList from "../../components/InvoiceList";

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
      <Head>
        <title>Invoices</title>
      </Head>
      <InvoiceList />
    </Layout>
  );
}
