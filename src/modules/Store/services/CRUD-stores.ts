import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../infra/axiosconfig";
import { IStore } from "../types/store";
import { StoreFormData } from "../schema/store.schema";

export enum EEndPoints {
  GETSTORES = "GETSTORES",
  GETSTOREBYID = "GETSTOREBYID",
}

const createStore = async (store: StoreFormData) => {
  const response = await api.post<IStore>("/stores", store);
  return response.data;
};

const getStore = async (storeId: number) => {
  const response = await api.get<IStore>(`/stores/${storeId}`);
  return response.data;
};

const updateStore = async (storeId: string, store: StoreFormData) => {
  const response = await api.put<IStore>(`/stores/${storeId}`, store);
  return response.data;
};

const deleteStore = async (storeId: number) => {
  const response = await api.delete<IStore>(`/stores/${storeId}`);
  return response.data;
};

const getAllStores = async (page?: number) => {
  const response = await api.get<IStore[]>("/stores", {
    params: {
      page: page || 1,
    },
  });
  return response.data;
};

export const usePostStore = ({
  onSubmitSuccess,
}: {
  onSubmitSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreFormData) => createStore(data),
    onSuccess: () => {
      if (onSubmitSuccess) onSubmitSuccess();
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTORES] });
    },
  });
};

export const useGetStore = (storeId: number) => {
  return useQuery({
    queryKey: [EEndPoints.GETSTOREBYID, storeId],
    queryFn: async () => getStore(storeId),
    enabled: !!storeId,
  });
};

export const useGetAllStores = ({ page }: { page?: number }) => {
  return useQuery({
    queryKey: [EEndPoints.GETSTORES],
    queryFn: () => getAllStores(page),
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StoreFormData }) =>
      updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTORES] });
    },
  });
};
export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeId: number) => deleteStore(storeId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTORES] }),
  });
};
