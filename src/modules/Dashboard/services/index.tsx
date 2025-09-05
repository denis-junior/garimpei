import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../infra/axiosconfig";
import {
  IFilterManage,
  IResponseDashboardBidsProduct,
  IResponseDashboardGain,
  IResponseDashboardNoBids,
  IResponseDashboardProductStore,
  IResponseManage,
} from "../types";

export enum EEndPointsDashboard {
  MANAGE = "clothing/manage",
  EVOLUTION = "dashboard/evolution",
  BIDS = "dashboard/bids-clothing",
  GAIN = "dashboard/gain",
  NO_BIDS = "dashboard/no-bids-stats",
}
export const useGetAllProductStores = (storeId?: number | string) => {
  return useQuery({
    queryKey: [EEndPointsDashboard.EVOLUTION, storeId],
    queryFn: async () => {
      const response = await api.get<IResponseDashboardProductStore[]>(
        `${EEndPointsDashboard.EVOLUTION}/${storeId}`
      );
      return (
        response?.data?.map((e) => {
          return {
            ...e,
            firstBid: e.firstBid ?? 0,
            lastBid: e.lastBid ?? 0,
          };
        }) ?? []
      );
    },
    enabled: !!storeId,
    refetchInterval: 10000,
  });
};

export const useGetBidsProduct = (productId: number) => {
  return useQuery({
    queryKey: [EEndPointsDashboard.BIDS, productId],
    queryFn: async () => {
      const response = await api.get<IResponseDashboardBidsProduct[]>(
        `${EEndPointsDashboard.BIDS}/${productId}`
      );
      return response.data;
    },
    enabled: !!productId,
    refetchInterval: 10000,
  });
};
export const useGetGainStore = (storeId: number) => {
  return useQuery({
    queryKey: [EEndPointsDashboard.GAIN, storeId],
    queryFn: async () => {
      const response = await api.get<IResponseDashboardGain[]>(
        `${EEndPointsDashboard.GAIN}/${storeId}`
      );
      return response.data;
    },
    enabled: !!storeId,
    refetchInterval: 10000,
  });
};

export const useGetNoBidsStats = (storeId: number) => {
  return useQuery({
    queryKey: [EEndPointsDashboard.NO_BIDS, storeId],
    queryFn: async () => {
      const response = await api.get<IResponseDashboardNoBids>(
        `${EEndPointsDashboard.NO_BIDS}/${storeId}`
      );
      return response.data;
    },
    refetchInterval: 10000,
  });
};

export const useGetClothingManage = (filters: IFilterManage) => {
  return useQuery({
    queryKey: [EEndPointsDashboard.MANAGE, ...Object.values(filters)],
    queryFn: async () => {
      const response = await api.get<IResponseManage>(
        EEndPointsDashboard.MANAGE,
        {
          params: filters,
        }
      );
      return response.data;
    },
  });
};

export const usePostMarkPaid = (onSubmitSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`clothing/${id}/mark-paid`);
      return response.data;
    },
    onSuccess: () => {
      if (onSubmitSuccess) onSubmitSuccess();
      queryClient.invalidateQueries({ queryKey: [EEndPointsDashboard.MANAGE] });
    },
  });
};

export const usePostForceNextBidder = (onSubmitSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`clothing/${id}/force-next-bidder`);
      return response.data;
    },
    onSuccess: () => {
      if (onSubmitSuccess) onSubmitSuccess();
      queryClient.invalidateQueries({ queryKey: [EEndPointsDashboard.MANAGE] });
    },
  });
};
