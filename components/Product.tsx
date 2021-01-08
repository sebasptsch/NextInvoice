import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  useToast,
  Link as ChakraLink,
  Spacer,
  Center,
  Badge,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { Stripe } from "stripe";
import Link from "next/link";

export default function ProductComponent({
  product,
}: {
  product: Stripe.Product;
}): JSX.Element {
  const toast = useToast();
  const router = useRouter();
  return (
    <Box borderWidth="1px" borderRadius="10px" p="1em" m="1em" key={product.id}>
      <Flex>
        <Link
          href={`/products/${product.id}`}
          passHref
          children={<ChakraLink>{product.name}</ChakraLink>}
        />
        <Spacer />
        <Center>
          <Badge colorScheme={product.active ? "green" : "red"}>
            {product.active ? "Enabled" : "Disabled"}
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
                onClick={() => {
                  axios
                    .post(`/api/products/${product.id}`, {
                      active: !product.active,
                    })
                    .then((response) => {
                      if (response.status === 200) {
                        toast({
                          title: "Success",
                          description: "Reload the page to see the changes.",
                          status: "success",
                        });
                        router.reload();
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
                key="delete"
              >
                {product.active ? "Disable" : "Enable"}
              </MenuItem>
            </MenuList>
          </Menu>
        </Center>
      </Flex>
    </Box>
  );
}
