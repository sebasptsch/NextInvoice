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
const stripe = new Stripe(
  "sk_test_51HBFOKIK06OmoiJkBem5hBPEBcwF0W5hKSf7BAWGaQrpRgRTOwGa3OwSZx8897KtwxHXCgFNmk44fVpw9vpaqdqh00UJ3zr5lN",
  { apiVersion: "2020-08-27" }
);

export default function EditInvoice({
  invoice,
  products,
}: {
  invoice: Stripe.Invoice;
  products: Array<Stripe.Product>;
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
                {console.log(products)}
                {products.map((product) => (
                  <option value={product.id} key={product.id}>
                    {product.name}
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
  const invoice = await stripe.invoices.retrieve(params.id);
  const products = await stripe.products.list();
  return {
    props: {
      invoice,
      products: products.data,
    },
  };
}
