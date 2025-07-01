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
