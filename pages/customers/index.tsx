import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonText,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import ErrorHandler from "../../components/ErrorHandler";
import { NextChakraLink } from "../../components/NextChakraLink";
import { useCustomers } from "../../helpers/helpers";

export default function Customers() {
  const router = useRouter();
  const toast = useToast();
  const [value, setValue] = useState("");
  const {
    setSize,
    size,
    customers,
    isLoading,
    isError,
    mutate,
    has_more,
    isLoadingMore,
  } = useCustomers(20);
  const handleChange = (event) => setValue(event.target.value);

  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.email?.toLowerCase().includes(value.toLowerCase()) ||
      customer.name?.toLowerCase().includes(value.toLowerCase()) ||
      JSON.parse(customer.metadata.students).some((student) => {
        const studentName = student.toLowerCase();
        return studentName.includes(value.toLowerCase());
      })
  );

  // useEffect(() => { filteredCustomers?.length === 0 ? setSize(size + 1) : null }, [customers])

  return (
    <>
      <Head>
        <title>Customers</title>
      </Head>
      <Flex>
        <Heading size="lg">Customers</Heading>
        <Spacer />
        <IconButton
          aria-label="Add Customer"
          icon={<AddIcon />}
          onClick={() => {
            router.push(`/customers/new`, `/customers/new`);
          }}
        />
      </Flex>

      <Center marginTop="1em">
        <Input placeholder="Search" value={value} onChange={handleChange} />
      </Center>
      <br />
      <Divider />
      {isLoading ? (
        <Box
          borderWidth="1px"
          borderRadius="10px"
          p="1em"
          m="1em"
          height="82px"
        >
          <SkeletonText height="100%" />
        </Box>
      ) : null}
      {filteredCustomers?.map((customer) => {
        const students = customer.metadata.students
          ? JSON.parse(customer.metadata.students)
          : [];
        return (
          <Box
            borderWidth="1px"
            borderRadius="10px"
            p="1em"
            m="1em"
            key={customer.id}
          >
            <Flex>
              <Center>
                <NextChakraLink
                  href="/customers/[id]"
                  as={`/customers/${customer?.id}`}
                >
                  {customer?.name?.length > 0
                    ? customer?.name
                    : customer?.email}
                </NextChakraLink>
              </Center>
              <Spacer />

              <Center>
                <Menu>
                  <MenuButton
                    as={Button}
                    size={"sm"}
                    rightIcon={<ChevronDownIcon />}
                    marginLeft="1em"
                  >
                    Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() =>
                        router.push(
                          `/customers/[id]/edit`,
                          `/customers/${customer?.id}/edit`
                        )
                      }
                    >
                      Edit
                    </MenuItem>

                    <MenuItem
                      key="Delete"
                      onClick={() => {
                        axios
                          .delete(`/api/customers/${customer?.id}`)
                          .then((response) => {
                            if (response.status === 200) {
                              toast({
                                title: "Success",
                                status: "success",
                              });
                              mutate();
                            }
                          })
                          .catch((error) => ErrorHandler(error, toast));
                      }}
                    >
                      Delete
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        router.push(
                          `/invoices/new?customer=${customer?.id}`,
                          `/invoices/new?customer=${customer?.id}`
                        )
                      }
                    >
                      Create Invoice
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Center>
            </Flex>
            {students?.map((student) => (
              <Badge key={student} m={1} colorScheme="blue">
                {student}
              </Badge>
            ))}
          </Box>
        );
      })}
      <Center>
        <Button
          onClick={() => setSize(size + 1)}
          disabled={!has_more || customers?.length === 0 || isLoading}
          isLoading={isLoadingMore}
        >
          Load More
        </Button>
      </Center>
    </>
  );
}
