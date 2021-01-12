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
import ErrorHandler from "./ErrorHandler";
import InvoiceComponent from "./Invoice";
import { useRouter } from "next/router";

export default function InvoiceList({ customer }: { customer?: string }) {
  // Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [invoices, setInvoices] = useState([]);
  const [loading, isLoading] = useState(false);
  const router = useRouter();
  const [value, setValue] = useState(router.query.status || "open");
  const toast = useToast();

  useEffect(() => {
    isLoading(true);
    setInvoices([]);
    axios({
      method: "GET",
      url: "/api/invoices",
      params: {
        status: value,
        customer,
      },
    })
      .then((response) => {
        setInvoices(response.data.data.sort((invoice) => invoice.due_date));
        isLoading(false);
      })
      .catch((error) => ErrorHandler(error, toast));
  }, [value]);

  // Component Functions
  const handleStatus = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
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
          <InvoiceComponent invoice={invoice} key={invoice.id} />
        ))
      ) : loading ? null : (
        <Text>No invoices here.</Text>
      )}
    </>
  );
}
