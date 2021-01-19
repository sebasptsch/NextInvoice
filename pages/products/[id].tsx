import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
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
import axios from "axios";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import ErrorHandler from "../../components/ErrorHandler";
import { usePrices, useProduct } from "../../extras/resourceHooks";

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps(context) {
  const { id } = context.params;
  const product = await stripe.products.retrieve(id);
  const prices = await stripe.prices.list();
  return {
    props: {
      product,
      prices,
    },
  };
}

export default function Products(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  // Hooks
  const router = useRouter();

  const { handleSubmit, errors, register, formState } = useForm();

  const { product, mutate } = useProduct(props.product.id, props.product);
  const { prices, mutate: pricemutate } = usePrices(undefined, props.prices);
  const toast = useToast();

  // Component Functions
  const submitHandler = (values) => {
    const { active, name, description } = values;
    return axios({
      method: "POST",
      url: `/api/products/${product.id}`,
      data: {
        active, /// Fix broken mutate
        name,
        description,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            status: "success",
          });
          mutate();
          // router.reload();
        }
      })
      .catch((error) => ErrorHandler(error, toast));
  };

  return (
    <>
      <Head>
        <title>View Product {product?.name}</title>
      </Head>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Heading>{product?.name}</Heading>

        <br />
        <Divider />
        <br />
        <StatGroup>
          <Stat>
            <StatLabel>Created</StatLabel>
            <StatNumber>
              {new Date(product?.created * 1000).toLocaleDateString()}
            </StatNumber>
            <StatHelpText></StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Last Updated</StatLabel>
            <StatNumber>
              {new Date(product?.updated * 1000).toLocaleDateString()}
            </StatNumber>
            <StatHelpText></StatHelpText>
          </Stat>
        </StatGroup>
        <br />
        <Table variant="simple">
          <TableCaption>
            <Button
              w="100%"
              textAlign="center"
              type="submit"
              isLoading={formState.isSubmitting}
            >
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
                  defaultValue={product?.active.toString()}
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
                  defaultValue={product?.name}
                />
              </Td>
            </Tr>
            <Tr>
              <Td>Description</Td>
              <Td>
                <Textarea
                  defaultValue={product?.description}
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
            <Button
              onClick={() => {
                router.push(
                  `/prices/new/?product=[id]`,
                  `/prices/new/?product=${product?.id}`
                );
              }}
            >
              New Price
            </Button>
          </Center>
        </Flex>

        <Divider marginBottom={2} />
        {prices
          ?.sort((price) => (price.active ? -1 : 1))
          ?.map((price) => {
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
                        <MenuItem
                          onClick={() => {
                            router.push(`/prices/[id]`, `/prices/${price.id}`);
                          }}
                        >
                          Edit/View
                        </MenuItem>
                        <MenuItem
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
                                  pricemutate();
                                }
                              })
                              .catch((error) => ErrorHandler(error, toast));
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
        {prices?.length == 0 && <Text>No Items here</Text>}
        <br />
      </form>
    </>
  );
}
