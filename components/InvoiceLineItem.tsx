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

export default function InvoiceLineItemComponent({
  lineitem,
}: {
  lineitem: Stripe.InvoiceLineItem;
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
        <Center>{lineitem.price.nickname}</Center>
        <Spacer />
        <Center>
          ${lineitem.price.unit_amount / 100}
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
              <MenuItem>Send</MenuItem>
            </MenuList>
          </Menu>
        </Center>
      </Flex>
    </Box>
  );
}
