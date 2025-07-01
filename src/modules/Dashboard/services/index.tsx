import { useQuery } from "@tanstack/react-query";
import api from "../../../infra/axiosconfig";
import {
  IResponseDashboardBidsProduct,
  IResponseDashboardGain,
  IResponseDashboardNoBids,
  IResponseDashboardProductStore,
} from "../types";

export const useGetAllProductStores = (storeId: number) => {
  return useQuery({
    queryKey: ["evolution", storeId],
    queryFn: async () => {
      const response = await api.get<IResponseDashboardProductStore[]>(
        `/dashboard/evolution/${storeId}`
      );
      return response.data.map((e) => {
        return {
          ...e,
          firstBid: e.firstBid ?? 0,
          lastBid: e.lastBid ?? 0,
        };
      });
    },
    enabled: !!storeId,
    refetchInterval: 10000,
  });
};

export const useGetBidsProduct = (productId: number) => {
  return useQuery({
    queryKey: ["bids-clothing", productId],
    queryFn: async () => {
      const response = await api.get<IResponseDashboardBidsProduct[]>(
        `/dashboard/bids-clothing/${productId}`
      );
      return response.data;
    },
    enabled: !!productId,
    refetchInterval: 10000,
  });
};
export const useGetGainStore = (storeId: number) => {
  return useQuery({
    queryKey: ["dashboard-gain", storeId],
    queryFn: async () => {
      const response = await api.get<IResponseDashboardGain[]>(
        `/dashboard/gain/${storeId}`
      );
      return response.data;
    },
    enabled: !!storeId,
    refetchInterval: 10000,
  });
};

export const useGetNoBidsStats = (storeId: number) => {
  return useQuery({
    queryKey: ["dashboard-no-bids", storeId],
    queryFn: async () => {
      const response = await api.get<IResponseDashboardNoBids>(
        `/dashboard/no-bids-stats/${storeId}`
      );
      return response.data;
    },
    refetchInterval: 10000,
  });
};
