import api from "@/infra/axiosconfig";
import { IProduct } from "@/modules/Product/types/product";
import { useQuery } from "@tanstack/react-query";
export enum EEndPoints {
  GETUSERHISTORY = "GETUSERHISTORY",
}
export const useGetFinishedWithBids = () => {
  return useQuery({
    queryKey: [EEndPoints.GETUSERHISTORY],
    queryFn: async () => {
      const response = await api.get<IProduct[]>(`clothing/finished-with-bids`);
      return response.data;
    },
  });
};

export const useSindAuctionsWonByBuyer = () => {
  return useQuery({
    queryKey: [EEndPoints.GETUSERHISTORY],
    queryFn: async () => {
      const response = await api.get<IProduct[]>(`clothing/won-auctions`);
      return response.data;
    },
  });
};
