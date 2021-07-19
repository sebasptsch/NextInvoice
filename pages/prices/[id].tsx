// UI Imports
import {
  Button,
  Divider,
  Heading,
  Input,
  Select,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import ErrorHandler from "../../components/ErrorHandler";
import Layout from "../../components/Layout";
import { usePrice } from "../../extras/resourceHooks";

export default function PriceView() {
  // Hooks
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();
  const router = useRouter();
  const { price, mutate } = usePrice(router.query.id);
  const [session, loading] = useSession();
  // Component Functions
  function submitHandler(values) {
    const { active, nickname, unit_amount } = values;
    mutate({ ...price, active, nickname }, false);
    return axios({
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
          });
          //   router.push(`/customers/${res.data.id}`);
          mutate();
        }
      })
      .catch((error) => ErrorHandler(error, toast));
  }

  if (typeof window !== "undefined" && loading) return null;

  if (session) {
    return (
      <Layout>
        <Head>
          <title>View Price {price?.nickname}</title>
        </Head>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Heading autoCapitalize="words">{price?.nickname}</Heading>
          <Divider m="1em 0 2em 0" />
          <StatGroup>
            <Stat>
              <StatLabel>Created</StatLabel>
              <StatNumber>{new Date(price?.created).toDateString()}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Active</StatLabel>
              <StatNumber textTransform="capitalize">
                <Select
                  defaultValue={price?.active.toString()}
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
                    defaultValue={price?.nickname}
                    name="nickname"
                    ref={register()}
                  />
                </Td>
              </Tr>
              <Tr>
                <Td>Unit Cost</Td>
                <Td>${price?.unit_amount / 100}</Td>
              </Tr>
              <Tr>
                <Td>Payment Type</Td>
                <Td>{price?.type}</Td>
              </Tr>
              <Tr>
                <Td>Product</Td>
                <Td>{price?.product}</Td>
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
  return <p>Access Denied</p>;
}
