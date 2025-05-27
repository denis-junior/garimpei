import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../service/Login.service";
import { FormDataLogin } from "../schema/Login.schema";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: FormDataLogin) => loginUser(data),
  });
};
