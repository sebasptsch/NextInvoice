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
import Head from "next/head";
import ErrorHandler from "../../../components/ErrorHandler";
import {
  listFetcher,
  fetcher,
  useCustomer,
  usePrices,
} from "../../../helpers/helpers";
import useSWR from "swr";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export async function getServerSideProps(context) {
  const { id } = context.params;
  const customer = await stripe.customers.retrieve(id);
  const prices = await stripe.prices.list();

  return {
    props: {
      prices: prices.data,
      customer,
    },
  };
}

export default function CustomerCreation(props) {
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
  const { data: prices } = useSWR(`/api/prices`, listFetcher, {
    initialData: props.prices,
  });
  const { data: customer, mutate } = useSWR(
    `/api/customers/${router.query.id}`,
    fetcher,
    { initialData: props.customer }
  );

  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const toast = useToast();

  // Component Functions
  function onSubmit(values) {
    const { email, description, phone, name } = values;
    let { students, classes } = values;
    students = students?.split(",")?.map((el) => el.trim());
    classes = classes?.filter((classitem) => classitem.amount > 0);
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
          });
          mutate();
        }
      })
      .catch((error) => ErrorHandler(error, toast));
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
          {prices
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
