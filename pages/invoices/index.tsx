import Layout from "../../components/Layout";

import Head from "next/head";
import InvoiceList from "../../components/InvoiceList";
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
  Spinner,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import InvoiceComponent from "../../components/Invoice";
import { useRouter } from "next/router";
import { AddIcon } from "@chakra-ui/icons";
import { useInvoices } from "../../helpers/helpers";
import { mutate } from "swr";

// Component Functions

export default function Invoices() {
  // Hooks
  const router = useRouter();
  const [value, setValue] = useState(router.query.status || "open");
  const toast = useToast();

  const { invoices, isLoading, isError, mutate } = useInvoices(value);
  const handleStatus = (e) => {
    setValue(e.target.value);
  };
  return (
    <Layout>
      <Head>
        <title>Invoices</title>
      </Head>

      <Stat textAlign="center">
        <StatLabel textTransform="capitalize">
          Total Amount in {value} invoices
        </StatLabel>
        <StatHelpText></StatHelpText>
        <StatNumber>
          ${invoices?.reduce((a, b) => a + b.amount_due, 0) / 100}
        </StatNumber>
      </Stat>

      <br />
      <Flex>
        <Heading size="lg">Invoices</Heading>
        <Spacer />

        <IconButton
          aria-label="Add Invoice"
          onClick={() => router.push(`/invoices/new`, `/invoices/new`)}
          icon={<AddIcon />}
        />
      </Flex>

      <Select value={value} onChange={handleStatus} marginTop="1em">
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
      <br />
      <Divider marginBottom={2} />
      {isLoading ? (
        <Box>
          <Spinner />
        </Box>
      ) : (
        invoices?.map((invoice) => (
          <InvoiceComponent invoice={invoice} key={invoice.id} />
        ))
      )}
    </Layout>
  );
}
