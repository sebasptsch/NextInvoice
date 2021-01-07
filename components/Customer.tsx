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

export default function CustomerComponent({
  customer,
}: {
  customer: Stripe.Customer;
}): JSX.Element {
  const toast = useToast();
  return (
    <Box
      borderWidth="1px"
      borderRadius="10px"
      p="1em"
      m="1em"
      key={customer?.id}
    >
      <Flex>
        <LinkBox href={"/customers/" + customer?.id}>{customer?.name}</LinkBox>
        <Spacer />

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
            <MenuItem>Edit</MenuItem>

            <MenuItem
              key="Delete"
              onClick={() => {
                axios
                  .delete(`/api/customers/${customer?.id}`)
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
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}
