import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "./main.layout";
import { AuctionRoutes } from "../modules/Auction/routes";
import AuctionViewerPage from "../modules/Auction/pages/AuctionViewerPage";
import { NotFound } from "../shared/NotFound";
import { ProducerRoutes } from "../modules/Producer/routes";
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
        path: "/producer",
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
