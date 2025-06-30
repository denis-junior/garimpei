import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../../../infra/axiosconfig";
import { IProduct } from "../types/product";
import { ProductFormData } from "../schema/product.schema";
import { EEndPoints } from "../../Store/services/CRUD-stores";
import { IPaginationResponse } from "@/types";

export enum EEndPointsProduct {
  GETPRODUCT = "GETPRODUCT",
  GETPRODUCTBYID = "GETPRODUCTBYID",
}

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

const postProductImage = async (product: FormData) => {
  const response = await api.post<IProduct>(
    "clothing/create-with-images",
    product,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const usePostProductWithImage = ({
  onSubmitSuccess,
}: {
  onSubmitSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => postProductImage(data),
    onSuccess: () => {
      if (onSubmitSuccess) onSubmitSuccess();
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTORES] });
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTOREBYID] });
      queryClient.invalidateQueries({
        queryKey: [EEndPointsProduct.GETPRODUCT],
      });
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
  return useInfiniteQuery({
    queryKey: [EEndPointsProduct.GETPRODUCT],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<IPaginationResponse<IProduct>>(
        "clothing",
        {
          params: {
            page: pageParam,
            limit: 20,
          },
        }
      );
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.lastPage ? undefined : pages.length + 1;
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTORES] });
      queryClient.invalidateQueries({ queryKey: [EEndPoints.GETSTOREBYID] });
    },
  });
};
