import api from "../../../infra/axiosconfig";
import { FormDataRegister } from "../schema/Register.schema";

export const registerUserBuyer = async (data: FormDataRegister) => {
  const response = await api.post("/buyer", data);
  return response.data;
};

export const registerUserSeller = async (data: FormDataRegister) => {
  const response = await api.post("/sellers", data);
  return response.data;
};
