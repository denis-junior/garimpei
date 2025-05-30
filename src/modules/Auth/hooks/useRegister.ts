import { useMutation } from "@tanstack/react-query";
import { FormDataRegister } from "../schema/Register.schema";
import {
  registerUserBuyer,
  registerUserSeller,
} from "../service/Register.service";

export const useRegisterBuyer = () => {
  return useMutation({
    mutationFn: (data: FormDataRegister) => registerUserBuyer(data),
  });
};

export const useRegisterSeller = () => {
  return useMutation({
    mutationFn: (data: FormDataRegister) => registerUserSeller({ ...data }),
  });
};
