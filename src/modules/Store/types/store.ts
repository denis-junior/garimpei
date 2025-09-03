import { IUser } from "@/types/User";
import { IProduct } from "../../Product/types/product";

export interface IStore {
  name: string;
  description: string;
  contact: string;
  instagram: string;
  address: string;
  id: number;
  clothings: IProduct[];
  seller: IUser;
}
