import { useMutation } from "@tanstack/react-query";
import { FormDataRegister } from "../schema/Register.schema";
import {
  registerUserBuyer,
  registerUserSeller,
} from "../service/Register.service";
import { useSearchParams } from "react-router-dom";

export const useRegisterBuyer = () => {
  const [URLSearchParams] = useSearchParams();
  const redirectUrl = String(
    URLSearchParams.get("redirectUrl") || URLSearchParams.get("redirectUrl")
  ).replace(/-/g, "/");

  return useMutation({
    mutationFn: (data: FormDataRegister) => registerUserBuyer(data),
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("authToken", data.token);
      if (redirectUrl) return (window.location.href = redirectUrl);
      window.location.href = "/";
    },
  });
};

export const useRegisterSeller = () => {
  return useMutation({
    mutationFn: (data: FormDataRegister) => registerUserSeller({ ...data }),
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("authToken", data.token);
      window.location.href = "/";
    },
  });
};
