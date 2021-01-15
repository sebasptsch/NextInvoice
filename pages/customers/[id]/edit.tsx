import {
  Divider,
  Heading,
  Textarea,
  useToast,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spacer,
  Text,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import Layout from "../../../components/Layout";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "yup-phone";
import Stripe from "stripe";
import Head from "next/head";
import ErrorHandler from "../../../components/ErrorHandler";
import { useEffect, useState } from "react";
import { fetcher, useCustomer, usePrices } from "../../../helpers/helpers";
import useSWR from "swr";
import Products from "../../products/new";

export default function CustomerCreation() {
  // Validation Schema for form
  const schema = yup.object().shape({
    email: yup.string().email().required(),

    description: yup.string(),
    phone: yup.string(),

    name: yup.string(),
  });

  // Hooks
  const router = useRouter();
  if (!router.query.id) return null;
  const { customer, isLoading } = useCustomer(router.query.id);
  const { prices } = usePrices();

  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const toast = useToast();

  // Component Functions
  function onSubmit(values) {
    const { email, description, phone, name } = values;
    let { students, classes } = values;
    students = students.split(",").map((el) => el.trim());
    classes = classes.filter((classitem) => classitem.amount > 0);
    const metadata = {
      students: JSON.stringify(students),
      classes: JSON.stringify(classes),
    };

    return axios({
      url: `/api/customers/${router.query.id}`,
      method: "POST",
      data: {
        email,
        description,
        name,
        phone,
        metadata,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            status: "success",
            description: "Redirecting...",
          });
          router.push(`/customers/[id]`, `/customers/${res.data.id}`);
        }
      })
      .catch((error) => ErrorHandler(error, toast));
  }

  if (isLoading) return <Spinner />;

  return (
    <Layout>
      <Head>
        <title>Edit Customer</title>
      </Head>
      <Heading marginTop="1em" marginBottom="0.5em" size="lg">
        Edit Customer
      </Heading>
      <Divider marginBottom={2} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Customer Name</FormLabel>

          <Input
            name="name"
            placeholder="name"
            ref={register}
            defaultValue={customer?.data?.name}
          />

          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>

          <Input
            name="email"
            placeholder="email"
            isRequired
            type="email"
            ref={register}
            defaultValue={customer?.data?.email}
          />

          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        {/* <FormControl isInvalid={errors.phone}>
            <FormLabel htmlFor="phone">Address</FormLabel>
            <Input
              name="address"
              isRequired
              placeholder="address"
              type="address"
              ref={register({ required: "Required." })}
            />
            <FormErrorMessage>
              {errors.address && errors.address.message}
            </FormErrorMessage>
          </FormControl> */}

        <FormControl isInvalid={errors.phone}>
          <FormLabel htmlFor="phone">Phone</FormLabel>

          <Input
            name="phone"
            placeholder="phone"
            type="phone"
            ref={register}
            defaultValue={customer?.data?.phone}
          />

          <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            name="description"
            placeholder="description"
            ref={register}
            defaultValue={customer?.data?.description}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.students}>
          <FormLabel>Children</FormLabel>
          <Input
            name="students"
            placeholder="Enter student names seperated by a comma (,)"
            defaultValue={JSON.parse(
              customer?.metadata?.students ? customer?.metadata.students : null
            ).join(",")}
            ref={register({
              required: "This is required",
              validate: (value) => value.split(",").length > 0,
            })}
          />
          <FormErrorMessage>{errors.students?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Classes</FormLabel>
          {prices?.data
            ?.sort((price) => (price.active ? -1 : 1))
            ?.map((price, index) => {
              let classes = JSON.parse(
                customer?.metadata?.classes ? customer?.metadata.classes : null
              );
              return (
                <Box
                  borderRadius="10px"
                  borderWidth="1px"
                  key={price.id}
                  m={4}
                  p={2}
                >
                  <Input
                    type="hidden"
                    value={price.id}
                    name={`classes[${index}].priceid`}
                    ref={register}
                  />
                  <Flex>
                    <NumberInput
                      w="4em"
                      defaultValue={
                        +classes.find(
                          (classobject) => classobject.priceid === price.id
                        )?.amount
                      }
                    >
                      <NumberInputField
                        ref={register()}
                        name={`classes[${index}].amount`}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Spacer />
                    <Text>
                      <Badge colorScheme={price.active ? "green" : "red"}>
                        {price.active ? "Enabled" : "Disabled"}
                      </Badge>
                      {price.nickname}
                    </Text>
                  </Flex>
                </Box>
              );
            })}
        </FormControl>
        <Button mt={4} isLoading={formState.isSubmitting} type="submit">
          Save
        </Button>
      </form>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const customer = await fetcher(`/api/customers/${id}`);
  const prices = await fetcher(`/api/prices`);

  return {
    props: {
      prices: prices.data,
      customer,
    },
  };
}
