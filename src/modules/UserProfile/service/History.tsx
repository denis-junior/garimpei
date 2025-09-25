import api from "@/infra/axiosconfig";
import { IProduct } from "@/modules/Product/types/product";
import { IPaginationResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
export enum EEndPoints {
  GETUSERHISTORY = "GETUSERHISTORY",
  HISTORYAUCTIONS = "HISTORYAUCTIONS",
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

export const useHistoryAuctions = (winner: boolean = false) => {
  return useQuery({
    queryKey: [EEndPoints.HISTORYAUCTIONS, winner],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IProduct>>(
        `clothing/history`,
        {
          params: {
            situation: winner ? "winner" : undefined,
          },
        }
      );
      return response.data;
    },
  });
};
