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
  Link,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

export default function InvoiceComponent({
  invoice,
}: {
  invoice: Stripe.Invoice;
}): JSX.Element {
  const toast = useToast();
  return (
    <Box
      borderWidth="1px"
      borderRadius="10px"
      p="1em"
      m="1em"
      key={invoice?.id}
    >
      <Flex>
        <LinkBox href={"/invoices/" + invoice?.id}>{invoice?.number}</LinkBox>
        <Spacer />
        <Box>
          ${invoice?.amount_due / 100}{" "}
          <Badge
            autoCapitalize="true"
            bgColor={
              invoice?.status == "paid"
                ? "green.400"
                : invoice?.status == "draft"
                ? "grey.500"
                : invoice?.due_date < Date.now()
                ? "red.300"
                : invoice?.status == "open"
                ? "blue.300"
                : null
            }
          >
            {invoice?.due_date < Date.now() && invoice?.status == "open"
              ? "Late"
              : invoice?.status}
          </Badge>
        </Box>
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
            <MenuItem as={Link} href={invoice?.invoice_pdf} key="download">
              Download
            </MenuItem>
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
                  .catch((error) => {
                    // console.log("error", error.message);
                    toast({
                      title: error.response.data.type,
                      status: "error",
                      description: error.response.data.raw.message,
                    });
                  });
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
                  .catch((error) => {
                    // console.log("error", error.message);
                    toast({
                      title: error.response.data.type,
                      status: "error",
                      description: error.response.data.raw.message,
                    });
                  });
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
                    .catch((error) => {
                      // console.log("error", error.message);
                      toast({
                        title: error.response.data.type,
                        status: "error",
                        description: error.response.data.raw.message,
                      });
                    });
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
                  .catch((error) => {
                    toast({
                      title: error.response.data.type,
                      status: "error",
                      description: error.response.data.raw.message,
                    });
                  });
              }}
            >
              Void
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}
