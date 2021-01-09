// UI Imports
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Divider,
  Editable,
  EditablePreview,
  EditableInput,
  Select,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Input,
  useToast,
} from "@chakra-ui/react";

// Hook Imports
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

// Serverside Imports
import Stripe from "stripe";
import Layout from "../../../components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import ErrorHandler from "../../../components/ErrorHandler";

export default function PriceView({ price }: { price: Stripe.Price }) {
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();
  const router = useRouter();

  function submitHandler(values) {
    const { active, nickname, unit_amount } = values;

    axios({
      method: "POST",
      url: `/api/prices/${price.id}`,
      data: {
        active,
        nickname,
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
      .catch((error) => ErrorHandler(error, toast));
  }

  return (
    <Layout>
      <Head>
        <title>View Price</title>
      </Head>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Heading autoCapitalize="words">{price.nickname}</Heading>
        <Divider m="1em 0 2em 0" />
        <StatGroup>
          <Stat>
            <StatLabel>Created</StatLabel>
            <StatNumber>{new Date(price.created).toDateString()}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Active</StatLabel>
            <StatNumber textTransform="capitalize">
              <Select
                defaultValue={price.active.toString()}
                ref={register()}
                name="active"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </Select>
            </StatNumber>
          </Stat>
        </StatGroup>
        <br />

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Field Name</Th>
              <Th>Current Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Nickname</Td>
              <Td>
                <Input
                  defaultValue={price.nickname}
                  name="nickname"
                  ref={register()}
                />
              </Td>
            </Tr>
            <Tr>
              <Td>Unit Cost</Td>
              <Td>${price.unit_amount / 100}</Td>
            </Tr>
            <Tr>
              <Td>Payment Type</Td>
              <Td>{price.type}</Td>
            </Tr>
            <Tr>
              <Td>Product</Td>
              <Td>{price.product}</Td>
            </Tr>
          </Tbody>
        </Table>
        <br />
        <Button
          textAlign="center"
          w="100%"
          type="submit"
          isLoading={formState.isSubmitting}
        >
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
  const price = await stripe.prices.retrieve(params.id);
  return {
    props: {
      price,
    },
  };
}
