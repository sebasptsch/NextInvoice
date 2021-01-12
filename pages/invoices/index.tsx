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
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import InvoiceList from "../../components/InvoiceList";
import ErrorHandler from "../../components/ErrorHandler";

export default function Invoices() {
  // Hooks
  const toast = useToast();

  return (
    <Layout>
      <Head>
        <title>Invoices</title>
      </Head>
      <InvoiceList />
    </Layout>
  );
}
