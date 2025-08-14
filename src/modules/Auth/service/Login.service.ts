import { useUser } from "@/hooks/useUser";
import api from "../../../infra/axiosconfig";
import { FormDataLogin } from "../schema/Login.schema";
// import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export const useLogin = ({ onLogin }: { onLogin?: () => void }) => {
  const { setUser } = useUser();
  // const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: FormDataLogin) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Bem vindo! :)", data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("authToken", data.token);
      setUser(data);
      if (onLogin) {
        return onLogin();
      }
      window.location.href = "/";
      // navigate("/");
    },
    onError: (error) => console.log(error),
  });
};
