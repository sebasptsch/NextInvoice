import Layout from "../../components/Layout";

import Stripe from "stripe";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spacer,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function Products({
  product,
  prices,
}: {
  product: Stripe.Product;
  prices: Array<Stripe.Price>;
}) {
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();
  const router = useRouter();
  const submitHandler = (values) => {
    const { active, name, description } = values;
    axios({
      method: "POST",
      url: `/api/products/${product.id}`,
      data: {
        active,
        name,
        description,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            status: "success",
            // description: "Redirecting...",
          });
          //   router.push(`/customers/${res.data.id}`);
          router.reload();
        }
      })
      .catch((error) => {
        toast({
          title: error?.response.data.type,
          description: error?.response.data.code,
        });
        console.log(error);
      });
  };
  return (
    <Layout>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Heading>{product.name}</Heading>

        <br />
        <Divider />
        <br />
        <StatGroup>
          <Stat>
            <StatLabel>Created</StatLabel>
            <StatNumber>
              {new Date(product.created * 1000).toLocaleDateString()}
            </StatNumber>
            <StatHelpText></StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Last Updated</StatLabel>
            <StatNumber>
              {new Date(product.updated * 1000).toLocaleDateString()}
            </StatNumber>
            <StatHelpText></StatHelpText>
          </Stat>
        </StatGroup>
        <br />
        <Table variant="simple">
          <TableCaption>
            <Button w="100%" textAlign="center" type="submit">
              Save
            </Button>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Field Name</Th>
              <Th>Current Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Active</Td>
              <Td>
                <Select
                  defaultValue={product.active.toString()}
                  ref={register()}
                  name="active"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </Select>
              </Td>
            </Tr>
            <Tr>
              <Td>Product Name</Td>
              <Td>
                <Input
                  name="name"
                  ref={register()}
                  defaultValue={product.name}
                />
              </Td>
            </Tr>
            <Tr>
              <Td>Description</Td>
              <Td>
                <Textarea
                  defaultValue={product.description}
                  name="description"
                  ref={register()}
                />
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <Flex>
          <Heading marginTop="1em" marginBottom="0.5em" size="lg">
            Prices
          </Heading>

          <Spacer />
          <Center>
            <Button as={Link} href={`/prices/new/?product=${product.id}`}>
              New Price
            </Button>
          </Center>
        </Flex>

        <Divider marginBottom={2} />
        {prices
          // .filter((price) => price.active)
          .sort((price) => (price.active ? -1 : 1))
          .map((price) => {
            return (
              <Box
                mt={4}
                p={2}
                borderWidth={"1px"}
                borderRadius={"10px"}
                key={price.id}
              >
                <Flex>
                  <Text textTransform={"capitalize"}>
                    {price.nickname} <br />${price.unit_amount / 100}
                  </Text>
                  <Spacer />
                  <Center>
                    <Badge colorScheme={price.active ? "green" : "red"}>
                      {price.active ? "Enabled" : "Disabled"}
                    </Badge>
                  </Center>
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
                        <MenuItem as={Link} href={`/prices/${price.id}`}>
                          Edit/View
                        </MenuItem>
                        <MenuItem
                          as={Link}
                          onClick={() => {
                            axios
                              .post(`/api/prices/${price?.id}`, {
                                active: !price.active,
                              })
                              .then((response) => {
                                if (response.status === 200) {
                                  toast({
                                    title: "Success",
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
                        >
                          {price.active ? "Disable Price" : "Enable Price"}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Center>
                </Flex>
              </Box>
            );
          })}
        {prices.length == 0 && <Text>No Items here</Text>}
        <br />
      </form>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const product = await stripe.products.retrieve(params.id);
  const prices = await stripe.prices.list({ product: params.id });
  //   console.log(invoice);
  //   const invoice = await res.invoice;
  //   console.log(await stripe.invoices.retrieve("in_1HQXddIK06OmoiJkg9DVgibR"));
  //   console.log(invoice);
  return {
    props: {
      product: product,
      prices: prices.data,
    },
  };
}

// export async function getStaticPaths() {
//   const res = await stripe.products.list();
//   const products = await res.data;

//   // console.log(allPosts?.map((post) => `/blog/${post.id}`));
//   //   console.log(invoices);
//   return {
//     paths: (await products?.map((product) => `/products/${product?.id}`)) || [],
//     fallback: true,
//   };
// }
