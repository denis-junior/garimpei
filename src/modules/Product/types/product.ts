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
  bids: IBid[];
  images: IImage[];
}

export interface IBid {
  id: number;
  bid: number;
  date: Date;
  buyer: Buyer;
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
