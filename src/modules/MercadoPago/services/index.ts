import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../infra/axiosconfig";
import {
  connectResponseData,
  paymentRequestData,
  processPaymentResponse,
  statusResponseData,
} from "../types";

export enum EEndPointsMercadoPago {
  GETSTATUS = "mercadopago/status",
  GETCONECT = "mercadopago/conectar",
  POSTPROCESS = "mercadopago/processar-pagamento-split",
}

export const useGetStatusSeller = (id?: number) => {
  return useQuery({
    queryKey: [EEndPointsMercadoPago.GETSTATUS, id],
    queryFn: async () => {
      const response = await api.get(
        `${EEndPointsMercadoPago.GETSTATUS}/${id}`
      );
      return response.data as statusResponseData;
    },
    enabled: !!id,
  });
};

export const useGetConectSeller = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.get(
        `${EEndPointsMercadoPago.GETCONECT}/${id}`
      );
      return response.data as connectResponseData;
    },
  });
};

export const usePostProcessPayment = () => {
  return useMutation({
    mutationFn: async (data: paymentRequestData) => {
      const response = await api.post(EEndPointsMercadoPago.POSTPROCESS, data);
      return response.data as processPaymentResponse;
    },
  });
};
