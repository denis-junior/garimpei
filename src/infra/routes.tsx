import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "./main.layout";
import { ProductRoutes } from "../modules/Product/routes";
import { NotFound } from "../shared/NotFound";
import { ProducerRoutes } from "../modules/Store/routes";
import { UserProfileRoutes } from "../modules/UserProfile/routes";
import { AuthRoutes } from "../modules/Auth/routes";
import { BidsRoutes } from "../modules/Bids/routes";
import HomeViewerPage from "../modules/Home/page/HomeViewerPage";
import { DashboardRoutes } from "@/modules/Dashboard/routes";

const AppRoutes = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomeViewerPage />,
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
        path: "/product",
        children: ProductRoutes,
      },
      {
        path: "/bids",
        children: BidsRoutes,
      },
      {
        path: "/dashboard",
        children: DashboardRoutes,
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
