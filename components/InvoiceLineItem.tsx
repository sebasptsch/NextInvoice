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
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Stripe from "stripe";

import { Router, useRouter } from "next/router";
import { NextChakraLink } from "./NextChakraLink";
import ErrorHandler from "./ErrorHandler";

export default function InvoiceLineItemComponent({
  lineitem,
  disabled,
}: {
  lineitem: Stripe.InvoiceLineItem;
  disabled: boolean;
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
      key={lineitem?.id}
    >
      <Flex>
        <Center>
          <Badge marginRight={2} colorScheme="blue">
            {lineitem.quantity}
          </Badge>
          {" " + lineitem.price.nickname?.toString()}
        </Center>
        <Spacer />
        <Center>
          ${lineitem.price.unit_amount / 100}
          <Menu>
            <MenuButton
              as={Button}
              size={"sm"}
              rightIcon={<ChevronDownIcon />}
              marginLeft="1em"
              disabled={disabled}
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  axios
                    .delete(`/api/invoiceitems/${lineitem.invoice_item}`)
                    .then(() => {
                      toast({ title: "Success" });
                      router.reload();
                    })
                    .catch((error) => ErrorHandler(error, toast));
                }}
              >
                Delete
              </MenuItem>
              <MenuItem>Modify</MenuItem>
            </MenuList>
          </Menu>
        </Center>
      </Flex>
    </Box>
  );
}
