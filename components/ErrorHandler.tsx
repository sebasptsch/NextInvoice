import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";

export default function ErrorHandler(error: AxiosError, toast) {
  error.response.data.type // If stripe error
    ? toast({
        title: error.response.data.type,
        status: "error",
        description: error.response.data.raw.message,
      }) // Display Toast to user
    : console.log(error);
}
