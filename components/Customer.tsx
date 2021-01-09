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
import { Router, useRouter } from "next/router";
import Stripe from "stripe";
import ErrorHandler from "./ErrorHandler";
import { NextChakraLink } from "./NextChakraLink";

export default function CustomerComponent({
  customer,
}: {
  customer: Stripe.Customer;
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
      key={customer?.id}
    >
      <Flex>
        <Center>
          <NextChakraLink
            href="/customers/[id]"
            as={`/customers/${customer.id}`}
          >
            {customer?.name}
          </NextChakraLink>
        </Center>
        <Spacer />

        <Center>
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
                    `/customers/[id]/edit`,
                    `/customers/${customer.id}/edit`
                  )
                }
              >
                Edit
              </MenuItem>

              <MenuItem
                key="Delete"
                onClick={() => {
                  axios
                    .delete(`/api/customers/${customer?.id}`)
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
                onClick={() =>
                  router.push(
                    `/invoices/new?=${customer.id}`,
                    `/invoices/new?=${customer.id}`
                  )
                }
              >
                Create Invoice
              </MenuItem>
            </MenuList>
          </Menu>
        </Center>
      </Flex>
    </Box>
  );
}
