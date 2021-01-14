import {
  Divider,
  Heading,
  InputGroup,
  InputRightElement,
  Textarea,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";

import axios from "axios";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "yup-phone";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import { CheckIcon } from "@chakra-ui/icons";
import Head from "next/head";
import ErrorHandler from "../../components/ErrorHandler";

export default function CustomerCreation() {
  // Validation Schema for Form
  const schema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required()
      .test("email-test", "This email is already in use", (value) => {
        return !customers.some((customer) => customer.email === value);
      }),
    description: yup.string(),
    phone: yup
      .string(),
      // .phone(),
      // .test("phone-test", "This phone is already in use", (value) => {
      //   return !customers.some((customer) => customer.phone === value);
      // }),
    name: yup.string(),
  });

  // Hooks
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>();
  const [prices, setPrices] = useState<Array<Stripe.Price>>();
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`/api/customers`)
      .then((response) => setCustomers(response.data.data))
      .catch((error) => ErrorHandler(error, toast));
    axios
      .get(`/api/prices`)
      .then((response) => setPrices(response.data.data))
      .catch((error) => ErrorHandler(error, toast));
  }, []);

  // Component Functions
  function onSubmit(values) {
    const { email, description, phone, name } = values;
    let { students } = values;
    let { classes } = values;
    students = students.split(",").map((el) => el.trim());
    classes = classes.filter((classitem) => classitem.amount > 0);
    // console.log(classes);
    const metadata = {
      students: JSON.stringify(students),
      classes: JSON.stringify(classes),
    };
    return axios
      .post("/api/customers", {
        email,
        description,
        name,
        phone,
        metadata,
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            status: "success",
            description: "Redirecting...",
          });
          router.push(`/customers/[id]`, `/customers/${res.data.customer.id}`);
        }
      })
      .catch((error) => ErrorHandler(error, toast));
  }

  return (
    <Layout>
      <Head>New Customer</Head>
      <Heading marginTop="1em" marginBottom="0.5em" size="lg">
        Create Customer
      </Heading>
      <Divider marginBottom={2} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">First name</FormLabel>

          <Input name="name" placeholder="name" ref={register} />

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
          />

          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.phone}>
          <FormLabel htmlFor="phone">Phone</FormLabel>
          <Input name="phone" placeholder="phone" type="phone" ref={register} />
          <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            name="description"
            placeholder="description"
            ref={register}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.students}>
          <FormLabel>Children</FormLabel>
          <Input
            name="students"
            placeholder="Enter student names seperated by a comma (,)"
            ref={register({
              required: "This is required",
              validate: (value) => value.split(",").length > 0,
            })}
          />
          <FormErrorMessage>{errors.students?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Classes per Week</FormLabel>
          {prices
            ?.filter((price) => price.active)
            ?.map((price, index) => (
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
                  <NumberInput defaultValue={0}>
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
                  <Text>{price.nickname}</Text>
                </Flex>
              </Box>
            ))}
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Layout>
  );
}
