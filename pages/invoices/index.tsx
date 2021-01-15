import Layout from "../../components/Layout";

import Head from "next/head";
import InvoiceList from "../../components/InvoiceList";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import { useRouter } from "next/router";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useInvoices } from "../../helpers/helpers";
import { mutate } from "swr";
import { NextChakraLink } from "../../components/NextChakraLink";

// Component Functions

export default function Invoices() {
  // Hooks
  const router = useRouter();
  const [value, setValue] = useState(router.query.status || "open");
  const toast = useToast();

  const { invoices, isLoading, isError, mutate } = useInvoices(value);
  const handleStatus = (e) => {
    router.replace(`/invoices?status=${e.target.value}`);
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
          <Box
            borderWidth="1px"
            borderRadius="10px"
            p="1em"
            m="1em"
            key={invoice?.id}
          >
            <Flex>
              <Center>
                <NextChakraLink
                  as={"/invoices/" + invoice?.id}
                  href={`/invoices/[id]`}
                >
                  {invoice.number}
                </NextChakraLink>
              </Center>
              <Spacer />
              <Center>
                ${invoice?.amount_due / 100}{" "}
                <Badge
                  autoCapitalize="true"
                  colorScheme={
                    invoice?.status == "paid"
                      ? "green"
                      : invoice?.status == "draft"
                      ? "grey"
                      : invoice?.due_date < Date.now() &&
                        invoice?.status === "open"
                      ? "red"
                      : invoice?.status == "open"
                      ? "blue"
                      : null
                  }
                >
                  {invoice?.due_date < Date.now() && invoice?.status == "open"
                    ? "Late"
                    : invoice?.status}
                </Badge>
                <Menu>
                  <MenuButton
                    as={Button}
                    size={"sm"}
                    rightIcon={<ChevronDownIcon />}
                    marginLeft="1em"
                  >
                    Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() =>
                        router.push(
                          "/invoices/[id]",
                          "/invoices/" + invoice?.id
                        )
                      }
                      hidden={invoice.status !== "draft"}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      key="download"
                      onClick={() => {
                        router.push(invoice?.invoice_pdf);
                      }}
                      hidden={invoice.status === "draft"}
                    >
                      Download
                    </MenuItem>

                    <MenuItem
                      href={invoice.hosted_invoice_url}
                      key="webpage"
                      hidden={invoice.status !== "open"}
                    >
                      Checkout Page
                    </MenuItem>
                    <MenuItem
                      key="send"
                      hidden={invoice.status !== ("open" || "draft")}
                      onClick={() => {
                        axios
                          .post(`/api/invoices/${invoice?.id}/send`)
                          .then((response) => {
                            toast({
                              title: "Sent!",
                              status: "success",
                            });
                            mutate();
                          })
                          .catch((error) => ErrorHandler(error, toast));
                      }}
                    >
                      Send
                    </MenuItem>
                    <MenuItem
                      key="Void"
                      hidden={invoice.status !== ("open" || "uncollectible")}
                      onClick={() => {
                        axios
                          .post(`/api/invoices/${invoice?.id}/void`)
                          .then((response) => {
                            toast({
                              title: "Success",
                              status: "success",
                            });
                            mutate();
                          })
                          .catch((error) => ErrorHandler(error, toast));
                      }}
                    >
                      Void
                    </MenuItem>
                    <MenuItem
                      key="mark_uncollectible"
                      hidden={invoice.status !== "open"}
                      onClick={() => {
                        axios
                          .post(
                            `/api/invoices/${invoice?.id}/mark_uncollectible`
                          )
                          .then((response) => {
                            toast({
                              title: "Success",
                              status: "success",
                            });
                            mutate();
                          })
                          .catch((error) => ErrorHandler(error, toast));
                      }}
                    >
                      Mark Uncollectible
                    </MenuItem>

                    <MenuItem
                      key="pay"
                      hidden={invoice.status === "paid"}
                      onClick={() => {
                        axios
                          .post(`/api/invoices/${invoice?.id}/pay`, {
                            paid_out_of_band: true,
                          })
                          .then((response) => {
                            toast({
                              title: "Success",

                              status: "success",
                            });
                            mutate();
                          })
                          .catch((error) => ErrorHandler(error, toast));
                      }}
                    >
                      Pay (Out of Hand)
                    </MenuItem>

                    <MenuItem
                      hidden={invoice.status !== "draft"}
                      key="Delete"
                      onClick={() => {
                        axios
                          .delete(`/api/invoices/${invoice?.id}`)
                          .then((response) => {
                            toast({
                              title: "Success",
                              status: "success",
                            });
                            mutate();
                          })
                          .catch((error) => ErrorHandler(error, toast));
                      }}
                    >
                      Delete
                    </MenuItem>
                    <MenuItem
                      key="finalize"
                      hidden={invoice.status !== "draft"}
                      onClick={() => {
                        axios
                          .post(`/api/invoices/${invoice.id}/finalize`)
                          .then((response) => {
                            toast({
                              title: "Success",
                              status: "success",
                            });
                            mutate();
                          })
                          .catch((error) => ErrorHandler(error, toast));
                      }}
                    >
                      Finalize
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Center>
            </Flex>
          </Box>
        ))
      )}
    </Layout>
  );
}
