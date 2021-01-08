import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  LinkBox,
  MenuButton,
  MenuItem,
  MenuList,
  Menu,
  Spacer,
  Text,
  useToast,
  Spinner,
  SkeletonText,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Stripe from "stripe";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useRouter } from "next/router";
import ProductComponent from "../../components/Product";
import Head from "next/head";

export default function Products() {
  const toast = useToast();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [products, setProducts] = useState<Array<Stripe.Product>>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    setProductsLoading(true);
    setProducts([]);
    axios({ url: `/api/products`, method: "GET" }).then((products) => {
      setProductsLoading(false);
      setProducts(products.data.data);
    });
  }, []);

  const handleChange = (event) => setValue(event.target.value);
  //   console.log(products);
  return (
    <Layout>
      <Head>
        <title>Products</title>
      </Head>
      <Flex>
        <Heading size="lg">Products</Heading> <Spacer />
        <IconButton
          aria-label="Add Product"
          icon={<AddIcon />}
          onClick={() => router.push("/products/new")}
        />
      </Flex>
      <Center marginTop="1em">
        <Input
          placeholder="Search Products"
          value={value}
          onChange={handleChange}
        />
      </Center>
      <br />
      <Divider />
      <br />
      {productsLoading ? (
        <Box borderWidth="1px" borderRadius="10px" p="1em" m="1em">
          <SkeletonText h="52px" />
        </Box>
      ) : null}
      {products
        .filter((product) =>
          product?.name.toLowerCase().includes(value.toLowerCase())
        )
        .sort((product) => (product.active ? -1 : 1))
        .map((product) => (
          <ProductComponent product={product} />
        ))}
    </Layout>
  );
}
