import { ShoppingBag, Tag, User } from "lucide-react";

export enum UserType {
  BUYER = "buyer",
  SELLER = "seller",
  ALL = "all",
}
const localstorage = localStorage.getItem("user");
const user = localstorage ? JSON.parse(localstorage) : null;

export const navigationItems = [
  {
    name: "Explore",
    path: "/",
    icon: <ShoppingBag className="w-5 h-5" />,
    offToken: true,
  },
  {
    name: "Lojas",
    path: "/store",
    icon: <Tag className="w-5 h-5" />,
    offToken: true,
  },
  {
    name: "Dashboard",
    path: `/dashboard/${user?.seller ? "seller" : "buyer"}`,
    icon: <Tag className="w-5 h-5" />,
    type: UserType.SELLER,
    offToken: false,
  },
  {
    name: "Perfil",
    path: `/profile/${user?.seller ? "seller" : "buyer"}`,
    icon: <User className="w-5 h-5" />,
    type: UserType.ALL,
    offToken: false,
  },
];
