import Layout from "../../components/Layout";

import Stripe from "stripe";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import Head from "next/head";
import ErrorHandler from "../../components/ErrorHandler";

export default function Products() {
  // Hooks
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();
  const router = useRouter();

  // Component Functions
  const submitHandler = (values) => {
    const { active, name, description } = values;
    return axios({
      method: "POST",
      url: `/api/products`,
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
          });
          router.push(`/products/[id]`, `/products/${res.data.id}`);
        }
      })
      .catch((error) => ErrorHandler(error, toast));
  };
  return (
    <Layout>
      <Head>
        <title>New Product</title>
      </Head>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Heading>Create New Product</Heading>
        <br />
        <Divider />

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
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Active</Td>
              <Td>
                <FormControl isInvalid={errors.active}>
                  <Select defaultValue={"true"} ref={register()} name="active">
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Select>
                  <FormErrorMessage>{errors.active?.message}</FormErrorMessage>
                </FormControl>
              </Td>
            </Tr>
            <Tr>
              <Td>Product Name</Td>
              <Td>
                <FormControl isInvalid={errors.name}>
                  <Input
                    name="name"
                    isRequired
                    ref={register({ required: "A name is required" })}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
              </Td>
            </Tr>
            <Tr>
              <Td>Description</Td>
              <Td>
                <FormControl isInvalid={errors.description}>
                  <Textarea name="description" ref={register()} />
                  <FormErrorMessage>
                    {errors.description?.message}
                  </FormErrorMessage>
                </FormControl>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </form>
    </Layout>
  );
}
