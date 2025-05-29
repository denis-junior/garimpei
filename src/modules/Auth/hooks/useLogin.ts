import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../service/Login.service";
import { FormDataLogin } from "../schema/Login.schema";
import { useUser } from "../../../hooks/useUser";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: FormDataLogin) => loginUser(data),
    onSuccess: (data) => {
      console.log("Bem vindo! :)", data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("authToken", data.token);
      setUser(data);
      navigate("/");
    },
  });
};
