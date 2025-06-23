import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../infra/axiosconfig";
import { UserShemaFormData } from "../schema/user.schema";

export enum EEndPoints {
  GETUSER = "GETUSER",
}

export const usePutBuyer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserShemaFormData }) => {
      return api.put(`/buyer/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETUSER] });
    },
  });
};

export const usePutSeller = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserShemaFormData }) => {
      return api.put(`/seller/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETUSER] });
    },
  });
};

export const useGetBuyer = (userId: number) => {
  return useQuery({
    queryKey: [EEndPoints.GETUSER, userId],
    queryFn: async () => {
      const response = await api.get(`/buyer/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useGetSeller = (userId: number) => {
  return useQuery({
    queryKey: [EEndPoints.GETUSER, userId],
    queryFn: async () => {
      const response = await api.get(`/seller/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};
