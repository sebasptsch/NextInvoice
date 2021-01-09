import {
  Divider,
  Heading,
  InputGroup,
  InputRightElement,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";

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
  const [customers, setCustomers] = useState<Array<Stripe.Customer>>();
  useEffect(() => {
    axios
      .get(`/api/customers`)
      .then((response) => setCustomers(response.data.data));
  }, []);

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
      .string()
      .phone()
      .test("phone-test", "This phone is already in use", (value) => {
        return !customers.some((customer) => customer.phone === value);
      }),
    name: yup.string().required(),
  });
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const toast = useToast();
  const router = useRouter();
  function onSubmit(values) {
    const { email, description, phone, name } = values;
    let { students } = values;
    // console.log(children.split(","));
    students = students.split(",").map((el) => el.trim());
    const metadata = { students: JSON.stringify(students) };
    // console.log(metadata);
    axios
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

          <Input name="name" placeholder="name" isRequired ref={register} />

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
