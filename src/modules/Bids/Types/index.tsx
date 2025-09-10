import { Buyer } from "../../Product/types/product";

export interface IBid {
  id: number;
  bid: number;
  date: Date;
  buyer: Buyer;
  time: string;
}
