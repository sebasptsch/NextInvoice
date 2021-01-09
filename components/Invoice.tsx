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

import { useRouter } from "next/router";
import { NextChakraLink } from "./NextChakraLink";
import ErrorHandler from "./ErrorHandler";

export default function InvoiceComponent({
  invoice,
}: {
  invoice: Stripe.Invoice;
}): JSX.Element {
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
              <MenuItem
                key="send"
                onClick={() => {
                  axios
                    .post(`/api/invoices/${invoice?.id}/send`)
                    .then((response) => {
                      if (response.status === 200) {
                        toast({
                          title: "Success",
                          description: "Reload the page to see the changes.",
                          status: "success",
                        });
                      }
                    })
                    .catch((error) => ErrorHandler(error, toast));
                }}
              >
                Send
              </MenuItem>
              <MenuItem
                key="pay"
                onClick={() => {
                  axios
                    .post(`/api/invoices/${invoice?.id}/pay`)
                    .then((response) => {
                      if (response.status === 200) {
                        toast({
                          title: "Success",
                          description: "Reload the page to see the changes.",
                          status: "success",
                        });
                      }
                    })
                    .catch((error) => ErrorHandler(error, toast));
                }}
              >
                Pay
              </MenuItem>
              {invoice?.status == "draft" ? (
                <MenuItem
                  key="Delete"
                  onClick={() => {
                    axios
                      .delete(`/api/invoices/${invoice?.id}`)
                      .then((response) => {
                        if (response.status === 200) {
                          toast({
                            title: "Success",
                            description: "Reload the page to see the changes.",
                            status: "success",
                          });
                        }
                      })
                      .catch((error) => ErrorHandler(error, toast));
                  }}
                >
                  Delete
                </MenuItem>
              ) : null}
              <MenuItem
                key="Void"
                onClick={() => {
                  axios
                    .post(`/api/invoices/${invoice?.id}/void`)
                    .then((response) => {
                      if (response.status === 200) {
                        toast({
                          title: "Success",
                          description: "Reload the page to see the changes.",
                          status: "success",
                        });
                      }
                    })
                    .catch((error) => ErrorHandler(error, toast));
                }}
              >
                Void
              </MenuItem>
            </MenuList>
          </Menu>
        </Center>
      </Flex>
    </Box>
  );
}
