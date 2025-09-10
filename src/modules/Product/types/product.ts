import { EStatus } from "@/enum";
import { IBid } from "../../Bids/Types";
import { IStore } from "../../Store/types/store";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  initial_bid: number;
  initial_date: Date;
  end_date: Date;
  size: string;
  store: IStore;
  initial_time: string;
  end_time: string;
  bids: IBid[];
  images: IImage[];
  current_winner_bid_id?: number;
  auction_attempt?: number;
  auctioned_at?: string;
  payment_warning_sent_at?: string;
  status: EStatus;
}

export interface Buyer {
  id: number;
  name: string;
  password: string;
  contact: string;
  instagram: string;
  cpf: string;
  email: string;
}

export interface IImage {
  id: number;
  url: string;
}
