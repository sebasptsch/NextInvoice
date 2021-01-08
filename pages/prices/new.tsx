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
import { useState } from "react";

// Serverside Imports
import Stripe from "stripe";
import Layout from "../../components/Layout";
import axios from "axios";
import { useRouter } from "next/router";

export default function PriceView({
  products,
}: {
  products: Array<Stripe.Product>;
}) {
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();
  const router = useRouter();
  const format = (val) => `$` + val;
  const parse = (val) => val.replace(/^\$/, "");

  const [value, setValue] = useState("0");
  function submitHandler(values) {
    const { nickname, unit_amount, product, active } = values;

    axios({
      method: "POST",
      url: `/api/prices`,
      data: {
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
            // description: "Redirecting...",
          });
          //   router.push(`/customers/${res.data.id}`);
          router.push(`/prices/${res.data.id}`);
        }
      })
      .catch((error) => {
        toast({
          title: error?.response.data.type,
          description: error?.response.data.code,
        });
        console.log(error);
      });
  }

  return (
    <Layout>
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
                <Select
                  ref={register()}
                  name="product"
                  defaultValue={router.query?.product}
                >
                  {products.map((product) => (
                    <option value={product.id} key={product.id}>
                      {product.name}
                    </option>
                  ))}
                </Select>
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

export async function getServerSideProps({ params }) {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const products = await stripe.products.list();
  return {
    props: {
      products: products.data,
    },
  };
}
