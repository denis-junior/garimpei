import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "./main.layout";
import { AuctionRoutes } from "../modules/Auction/routes";
import { ProductRoutes } from "../modules/Product/routes";
import AuctionViewerPage from "../modules/Auction/pages/AuctionViewerPage";
import { NotFound } from "../shared/NotFound";
import { ProducerRoutes } from "../modules/Store/routes";
import { UserProfileRoutes } from "../modules/UserProfile/routes";
import { AuthRoutes } from "../modules/Auth/routes";

const AppRoutes = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <AuctionViewerPage />,
      },
      {
        path: "/store",
        children: ProducerRoutes,
      },
      {
        path: "/profile",
        children: UserProfileRoutes,
      },
      {
        path: "/auction",
        children: AuctionRoutes,
      },
      {
        path: "/product",
        children: ProductRoutes,
      },
    ],
  },
  {
    path: "/auth",
    children: AuthRoutes,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default AppRoutes;
