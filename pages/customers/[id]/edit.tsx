import {
  Divider,
  Heading,
  InputGroup,
  InputRightElement,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import Layout from "../../../components/Layout";
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

export default function CustomerCreation({
  customer,
}: {
  customer: Stripe.Customer;
}) {
  const router = useRouter();

  const schema = yup.object().shape({
    email: yup.string().email().required(),

    description: yup.string(),
    phone: yup.string().phone(),

    name: yup.string().required(),
  });
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const toast = useToast();
  function onSubmit(values) {
    const { email, description, phone, name } = values;
    let { students } = values;
    // console.log(children.split(","));
    students = students.split(",").map((el) => el.trim());
    const metadata = { students: JSON.stringify(students) };
    axios({
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
          router.push(`/customers/${res.data.id}`);
        }
      })
      .catch((error) => {
        toast({
          title: error?.response.data.type,
          description: error?.response.data.code,
        });
      });
  }

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
          <FormLabel htmlFor="name">First name</FormLabel>

          <Input
            name="name"
            placeholder="name"
            isRequired
            ref={register}
            defaultValue={customer?.name}
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
            defaultValue={customer?.email}
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
            defaultValue={customer?.phone}
          />

          <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            name="description"
            placeholder="description"
            ref={register}
            defaultValue={customer?.description}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.students}>
          <FormLabel>Children</FormLabel>
          <Input
            name="students"
            placeholder="Enter student names seperated by a comma (,)"
            defaultValue={JSON.parse(customer.metadata.students).join(",")}
            ref={register({
              required: "This is required",
              validate: (value) => value.split(",").length > 0,
            })}
          />
          <FormErrorMessage>{errors.students?.message}</FormErrorMessage>
        </FormControl>
        <Button mt={4} isLoading={formState.isSubmitting} type="submit">
          Save
        </Button>
      </form>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const customer = await stripe.customers.retrieve(params.id);
  return {
    props: {
      customer,
    },
  };
}
