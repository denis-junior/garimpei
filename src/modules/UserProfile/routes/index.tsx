import BuyerUserProfilePage from "../pages/BuyerUserProfilePage";
import SellerUserProfilePage from "../pages/SellerUserProfilePage";

export const UserProfileRoutes = [
  {
    path: "buyer",
    element: <BuyerUserProfilePage />,
  },
  {
    path: "seller",
    element: <SellerUserProfilePage />,
  },
];
