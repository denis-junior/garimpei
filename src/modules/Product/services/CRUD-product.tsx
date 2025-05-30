import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../infra/axiosconfig";
import { IProduct } from "../types/product";
import { ProductFormData } from "../schema/product.schema";

export enum EEndPoints {
  GETSTORES = "GETSTORES",
  GETSTOREBYID = "GETSTOREBYID",
}

const createProduct = async (product: ProductFormData) => {
  const response = await api.post<IProduct>("clothing", product);
  return response.data;
};

const getProduct = async (productId: string) => {
  const response = await api.get<IProduct>(`clothing/${productId}`);
  return response.data;
};

const updateProduct = async (productId: string, product: ProductFormData) => {
  const response = await api.put<IProduct>(`clothing/${productId}`, product);
  return response.data;
};

const deleteProduct = async (productId: number) => {
  const response = await api.delete<IProduct>(`clothing/${productId}`);
  return response.data;
};

const getAllProduct = async () => {
  const response = await api.get<IProduct[]>("clothing");
  return response.data;
};

export const usePostProduct = ({
  onSubmitSuccess,
}: {
  onSubmitSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => createProduct(data),
    onSuccess: () => {
      if (onSubmitSuccess) onSubmitSuccess();
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTORES] });
    },
  });
};

export const useGetProduct = (storeId: string) => {
  return useQuery({
    queryKey: [EEndPoints.GETSTOREBYID, storeId],
    queryFn: async () => getProduct(storeId),
    enabled: !!storeId,
  });
};

export const useGetAllProduct = () => {
  return useQuery({
    queryKey: [EEndPoints.GETSTORES],
    queryFn: getAllProduct,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTORES] });
    },
  });
};
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeId: number) => deleteProduct(storeId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTORES] }),
  });
};
