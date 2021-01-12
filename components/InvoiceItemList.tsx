import { AddIcon } from "@chakra-ui/icons";
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ErrorHandler from "./ErrorHandler";
import InvoiceComponent from "./Invoice";
import NewInvoicePage from "../pages/invoices/new";
import { Router, useRouter } from "next/router";
import Stripe from "stripe";
import InvoiceLineItemComponent from "./InvoiceLineItem";

export default function InvoiceItemList({ invoice }: { invoice }) {
  // Hooks
  const invoiceLineItems: Array<Stripe.InvoiceLineItem> = invoice.lines?.data;
  const router = useRouter();

  return (
    <>
      <Flex marginBottom={"1em"}>
        <Center>
          <Heading size="lg">Invoice Items</Heading>
        </Center>

        <Spacer />
      </Flex>

      <Divider marginBottom={2} />

      {invoiceLineItems?.length != 0 ? (
        invoiceLineItems?.map((lineitem) => (
          <InvoiceLineItemComponent lineitem={lineitem} key={lineitem.id} />
        ))
      ) : (
        <Text>No items in invoice here.</Text>
      )}
    </>
  );
}
