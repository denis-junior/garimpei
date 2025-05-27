import api from "../../../infra/axiosconfig";
import { FormDataRegister } from "../schema/Register.schema";

export const registerUser = async (data: FormDataRegister) => {
  const response = await api.post("/register", data);
  return response.data;
};
