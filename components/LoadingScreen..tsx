import { Center, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";

export default function LoadingScreen() {
  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <Center h="100vh" w="100%">
        <Spinner size="xl" />
      </Center>
    </>
  );
}
