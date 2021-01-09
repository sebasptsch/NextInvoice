import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  LinkBox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Center,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Stripe from "stripe";

import { Router, useRouter } from "next/router";
import { NextChakraLink } from "./NextChakraLink";
import ErrorHandler from "./ErrorHandler";

export default function InvoiceComponent({
  invoice,
}: {
  invoice: Stripe.Invoice;
}): JSX.Element {
  // Hooks
  const toast = useToast();
  const router = useRouter();
  return (
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
            {invoice?.number}
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
                : invoice?.due_date < Date.now() && invoice?.status != "open"
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
              {invoice?.status == "draft" ? <MenuItem>Edit</MenuItem> : null}
              <MenuItem href={invoice?.invoice_pdf} key="download">
                Download
              </MenuItem>
              {invoice.status === "open" ? (
                <MenuItem href={invoice.hosted_invoice_url} key="webpage">
                  Checkout Page
                </MenuItem>
              ) : null}
              {invoice.status === "open" ? (
                <MenuItem
                  key="send"
                  onClick={() => {
                    axios
                      .post(`/api/invoices/${invoice?.id}/send`)
                      .then((response) => {
                        if (response.status === 200) {
                          toast({
                            title: "Sent!",
                            status: "success",
                          });
                        }
                      })
                      .catch((error) => ErrorHandler(error, toast));
                  }}
                >
                  Send
                </MenuItem>
              ) : null}
              {invoice.status !== "paid" ? (
                <MenuItem
                  key="pay"
                  onClick={() => {
                    axios
                      .post(`/api/invoices/${invoice?.id}/pay`)
                      .then((response) => {
                        if (response.status === 200) {
                          toast({
                            title: "Success",

                            status: "success",
                          });
                          router.reload();
                        }
                      })
                      .catch((error) => ErrorHandler(error, toast));
                  }}
                >
                  Pay
                </MenuItem>
              ) : null}
              {invoice?.status == "draft" ? (
                <>
                  <MenuItem
                    key="Delete"
                    onClick={() => {
                      axios
                        .delete(`/api/invoices/${invoice?.id}`)
                        .then((response) => {
                          if (response.status === 200) {
                            toast({
                              title: "Success",
                              status: "success",
                            });
                            router.reload();
                          }
                        })
                        .catch((error) => ErrorHandler(error, toast));
                    }}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem
                    key="finalize"
                    onClick={() => {
                      axios
                        .post(`/api/invoices/${invoice.id}/finalize`)
                        .then((response) => {
                          if (response.status === 200) {
                            toast({
                              title: "Success",
                              status: "success",
                            });
                            router.reload();
                          }
                        })
                        .catch((error) => ErrorHandler(error, toast));
                    }}
                  >
                    Finalize
                  </MenuItem>
                </>
              ) : null}
              {invoice.status === "open" ? (
                <MenuItem
                  key="Void"
                  onClick={() => {
                    axios
                      .post(`/api/invoices/${invoice?.id}/void`)
                      .then((response) => {
                        if (response.status === 200) {
                          toast({
                            title: "Success",

                            status: "success",
                          });
                          router.reload();
                        }
                      })
                      .catch((error) => ErrorHandler(error, toast));
                  }}
                >
                  Void
                </MenuItem>
              ) : null}
            </MenuList>
          </Menu>
        </Center>
      </Flex>
    </Box>
  );
}
