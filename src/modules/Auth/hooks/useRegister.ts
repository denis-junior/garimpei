import { useMutation } from "@tanstack/react-query";
import { FormDataRegister } from "../schema/Register.schema";
import { registerUser } from "../service/Register.service";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: FormDataRegister) => registerUser(data),
  });
};
