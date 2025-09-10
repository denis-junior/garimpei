export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  instagram: string;
  number: string;
  preferences: {
    sizes: string[];
    categories: string[];
  };
  createdAuctions: string[];
  participatedAuctions: string[];
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  images: string[];
  size: string;
  category: string;
  startingPrice: number;
  currentBid: number;
  startDate: string;
  endDate: string;
  producerId: string;
  bids: Bid[];
  status: "upcoming" | "active" | "ended";
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  timestamp: string;
}

export interface IPaginationResponse<T> {
  items: T[];
  lastPage: boolean;
}
