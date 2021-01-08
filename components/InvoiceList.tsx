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
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import InvoiceComponent from "./Invoice";

export default function InvoiceList({ customer }: { customer?: number }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, isLoading] = useState(false);
  const [value, setValue] = useState("open");
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
    }).then((response) => {
      setInvoices(response.data.data.sort((invoice) => invoice.due_date));
      isLoading(false);
    });
  }, [value]);

  const handleStatus = (e) => {
    setValue(e.target.value);
  };
  return (
    <>
      <Flex>
        <Heading size="lg">Invoices</Heading>
        <Spacer />

        <IconButton aria-label="Add Invoice" icon={<AddIcon />} disabled />
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
