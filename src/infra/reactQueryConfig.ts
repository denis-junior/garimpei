import { QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
    mutations: {
      onError: (error: any) => {
        if (
          error?.response?.data?.errors?.length &&
          error?.response?.data?.errors.length > 0
        ) {
          error.response.data.errors.forEach((err: string) => {
            toast(err, {
              type: "error",
            });
          });
        } else {
          toast(error?.response?.data?.message || "An error occurred", {
            type: "error",
          });
        }
      },
    },
  },
});

export default queryClient;
