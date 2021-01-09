import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";

export default function ErrorHandler(error: AxiosError, toast) {
  error.response.data.type
    ? toast({
        title: error.response.data.type,
        status: "error",
        description: error.response.data.raw.message,
      })
    : console.log(error);
}
