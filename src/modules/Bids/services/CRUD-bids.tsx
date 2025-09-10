import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../infra/axiosconfig";
import { EEndPoints } from "../../Store/services/CRUD-stores";

export enum EEndPointsBids {
  GETBIDS = "GETBIDS",
}

export const usePostBid = (onSubmitSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { clothing: number; bid: number }) => {
      const response = await api.post(`bid`, { ...params });
      return response.data;
    },
    onSuccess: () => {
      if (onSubmitSuccess) onSubmitSuccess();
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTORES] });
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTOREBYID] });
    },
  });
};
