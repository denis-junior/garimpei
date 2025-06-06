import api from "../../../infra/axiosconfig";
import { FormDataLogin } from "../schema/Login.schema";

export const loginUser = async (data: FormDataLogin) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
