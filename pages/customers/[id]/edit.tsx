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
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Stripe from "stripe";
import * as yup from "yup";
import ErrorHandler from "../../../components/ErrorHandler";
import Layout from "../../../components/Layout";
import { useCustomer, usePrices } from "../../../extras/resourceHooks";
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps(context) {
  const { id } = context.params;
  const customer = await stripe.customers.retrieve(id);
  const prices = await stripe.prices.list();

  return {
    props: {
      prices,
      customer,
    },
  };
}

export default function CustomerCreation(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  // Validation Schema for form
  const schema = yup.object().shape({
    email: yup.string().email().required(),

    description: yup.string(),
    phone: yup.string(),

    name: yup.string(),
  });

  // Hooks
  const router = useRouter();
  // const { prices } = usePrices();
  const { prices } = usePrices(undefined, props.prices);
  const { customer, mutate } = useCustomer(props.customer.id);

  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const toast = useToast();

  // Component Functions
  function onSubmit(values) {
    const { email, description, phone, name } = values;
    let { students } = values;
    students = students?.split(",")?.map((el) => el.trim());
    const metadata = {
      students: JSON.stringify(students),
    };
    mutate(
      {
        ...customer,
        email,
        description,
        name,
        phone,
        metadata,
      },
      false
    );
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
          });
          mutate();
        }
      })
      .catch((error) => ErrorHandler(error, toast));
  }

  return (
    <Layout>
      <Head>
        <title>
          Edit Customer{" "}
          {customer?.name?.length > 0 ? customer?.name : customer?.email}
        </title>
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
            defaultValue={JSON.parse(
              customer?.metadata?.students ? customer?.metadata.students : null
            )?.join(",")}
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
