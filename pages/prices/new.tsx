// UI Imports
import {
  Button,
  Divider,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
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
import { useState } from "react";
// Hook Imports
import { useForm } from "react-hook-form";
// Serverside Imports
import Stripe from "stripe";
import ErrorHandler from "../../components/ErrorHandler";
import Layout from "../../components/Layout";
import { useProducts } from "../../extras/resourceHooks";

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

export default function PriceView() {
  // Hooks
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();
  const router = useRouter();
  const [value, setValue] = useState("0");
  const { products } = useProducts();
  const [session, loading] = useSession();

  // Component Functions
  const format = (val) => `$` + val;
  const parse = (val) => val.replace(/^\$/, "");
  function submitHandler(values) {
    const { nickname, unit_amount, product, active } = values;
    return axios({
      method: "POST",
      url: `/api/prices`,
      data: {
        nickname:
          products?.find((productobj) => productobj.id === product).name +
          " - " +
          nickname,

        unit_amount: parse(unit_amount) * 100,
        active,
        currency: "AUD",
        product,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            status: "success",
          });

          router.push(`/prices/[id]`, `/prices/${res.data.id}`);
        }
      })
      .catch((error) => ErrorHandler(error, toast));
  }

  if (session) {
    return (
      <Layout>
        <Head>
          <title>New Price</title>
        </Head>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Heading autoCapitalize="words">Create New Price</Heading>
          <Divider m="1em 0 2em 0" />
          <StatGroup>
            <Stat>
              <StatLabel>Price Active</StatLabel>
              <StatNumber textTransform="capitalize">
                <Select
                  defaultValue={true.toString()}
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
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Nickname</Td>
                <Td>
                  <Input defaultValue={""} name="nickname" ref={register()} />
                </Td>
              </Tr>
              <Tr>
                <Td>Unit Cost</Td>
                <Td>
                  <NumberInput
                    onChange={(valueString) => setValue(parse(valueString))}
                    value={format(value)}
                  >
                    <NumberInputField ref={register()} name="unit_amount" />
                  </NumberInput>
                </Td>
              </Tr>
              <Tr>
                <Td>Product</Td>
                <Td>
                  <Input
                    ref={register()}
                    name="product"
                    defaultValue={router.query?.product}
                    list="products"
                  />
                  <datalist id="products">
                    {products?.map((product) => (
                      <option value={product.id} key={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </datalist>
                </Td>
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
