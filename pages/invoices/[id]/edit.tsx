import Stripe from "stripe";
import axios from "axios";
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";

export default function EditInvoice({
  invoice,
  prices,
}: {
  invoice: Stripe.Invoice;
  prices: Array<Stripe.Price>;
}) {
  const invoiceLines = invoice.lines.data;
  const [lines, setLines] = useState(invoiceLines);

  useEffect(() => {
    setLines(lines);
    console.log("line");
  }, [lines]);

  console.log(lines);
  return (
    <Layout>
      <Table overflowY="scroll">
        <Thead>
          <Tr>
            <Th>Description</Th>
            <Th>QTY</Th>
            <Th>Unit Price</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {lines.map((product, index) =>
            ItemRow(index, product, lines, setLines)
          )}
        </Tbody>
        <Tfoot>
          <Tr>
            <Td>
              <Select>
                {console.log(prices)}
                {prices.map((price) => (
                  <option value={price.id} key={price.id}>
                    {price}
                  </option>
                ))}
              </Select>

              <Button mt={4}>Add</Button>
            </Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
        </Tfoot>
      </Table>

      {/* <textarea value={JSON.stringify(lines)} style={{ width: "100%" }} /> */}
    </Layout>
  );
}

function ItemRow(
  index: number,
  product: Stripe.InvoiceLineItem,
  lines: Stripe.InvoiceLineItem[],
  setLines
): JSX.Element {
  const changeHandler = (e, index) => {
    let newArr = [...lines];
    newArr[index][e.target.name] = e.target.value;
    setLines(newArr);
  };

  return (
    <Tr key={index}>
      <Td>{product.description}</Td>
      <Td isNumeric>
        <Input
          value={lines[index].quantity}
          onChange={(e) => changeHandler(e, index)}
          name="quantity"
        />
      </Td>
      <Td isNumeric>${product.price.unit_amount / 100}</Td>
      <Td isNumeric>
        ${console.log(lines[index].quantity)}
        {(lines[index].price.unit_amount * lines[index].quantity) / 100}
      </Td>
    </Tr>
  );
}

export async function getServerSideProps({ params }) {
  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });
  const invoice = await stripe.invoices.retrieve(params.id);
  const prices = await stripe.prices.list();
  return {
    props: {
      invoice,
      prices: prices.data,
    },
  };
}
