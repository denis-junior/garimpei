import { EStatus } from "@/enum";
import { IProduct } from "@/modules/Product/types/product";

export interface IResponseDashboardProductStore {
  clothingId: number;
  clothingName: string;
  firstBid?: number;
  initialBid: number;
  lastBid?: number;
}

export interface IResponseDashboardBidsProduct {
  bid: number;
  date: string;
  isInitial: boolean;
  time: string;
}

export interface IResponseDashboardGain {
  name: string;
  value: number;
  total?: boolean;
}

export interface IResponseDashboardNoBids {
  percentageNoBids: number;
  sumInitialNoBids: number;
  finishedNoBids: number;
}

export interface IResponseManage {
  items: IProduct[];
}

export interface IFilterManage {
  textquery?: string;
  status?: EStatus;
  size?: number;
  initialBid?: number;
  maxBid?: number;
  initialDate?: string;
  endDate?: string;
  storeId?: number;
}
