import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import ErrorHandler from "../../components/ErrorHandler";
import Layout from "../../components/Layout";
import { useCustomers } from "../../extras/resourceHooks";

export default function CustomerCreation() {
  // Hooks
  const { customers } = useCustomers();
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();
  const router = useRouter();

  // Component Functions
  function onSubmit(values) {
    const { email, description, phone, name } = values;
    let { students } = values;
    students = students.split(",").map((el) => el.trim());
    const metadata = {
      students: JSON.stringify(students),
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
          });
          router.push(`/customers`);
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
            ref={register({
              validate: (value) => {
                return !customers.some((customer) => customer.email === value);
              },
            })}
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
