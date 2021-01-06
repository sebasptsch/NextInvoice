import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box as Box,
  Flex,
  Heading,
  LinkBox,
  Spacer,
  Table,
  Text,
  Thead,
  Tr,
  Th,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Button,
  Center,
  toast,
  Link,
} from "@chakra-ui/react";

import { useState } from "react";
import Layout from "../../components/Layout";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

import { useToast } from "@chakra-ui/react";
import axios from "axios";

async () => {
  const inv = await stripe.invoices.retrieve("in_1I6WFeIK06OmoiJkqRImDcuW");
  console.log(inv);
};

export default function Invoices({
  invoices,
}: {
  invoices: Array<Stripe.Invoice>;
}) {
  const toast = useToast();

  return (
    <Layout>
      <Heading size="xl">Invoices</Heading>

      {invoices.map((invoice) => {
        return (
          <Box
            borderWidth="1px"
            borderRadius="10px"
            p="1em"
            m="1em"
            key={invoice.id}
          >
            <Flex>
              <LinkBox href={"/invoices/" + invoice.id}>
                {invoice.number}
              </LinkBox>
              <Spacer />
              <Box>
                ${invoice.amount_due / 100}{" "}
                <Badge
                  autoCapitalize="true"
                  bgColor={
                    invoice.status == "paid"
                      ? "green.400"
                      : invoice.status == "draft"
                      ? "grey.500"
                      : invoice.due_date < Date.now()
                      ? "red.300"
                      : invoice.status == "open"
                      ? "blue.300"
                      : null
                  }
                >
                  {invoice.due_date < Date.now() && invoice.status == "open"
                    ? "Late"
                    : invoice.status}
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
                  {invoice.status == "draft" ? <MenuItem>Edit</MenuItem> : null}
                  <MenuItem as={Link} href={invoice.invoice_pdf}>
                    Download
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      axios
                        .post(`/api/invoices/${invoice.id}/send`)
                        .then((data) => console.log(data));
                    }}
                  >
                    Send
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      axios
                        .post(`/api/invoices/${invoice.id}/pay`)
                        .then((data) => console.log(data));
                    }}
                  >
                    Pay
                  </MenuItem>
                  {invoice.status == "draft" ? (
                    <MenuItem
                      onClick={() => {
                        axios
                          .delete(`/api/invoices/${invoice.id}`)
                          .then((data) => console.log(data));
                      }}
                    >
                      Delete
                    </MenuItem>
                  ) : null}
                  <MenuItem
                    onClick={() => {
                      axios
                        .post(`/api/invoices/${invoice.id}/void`)
                        .then((data) => console.log(data));
                    }}
                  >
                    Void
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Box>
        );
      })}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await stripe.invoices.list({});
  const invoices = await res.data;

  return {
    props: {
      invoices,
    },
    revalidate: 1,
  };
}
