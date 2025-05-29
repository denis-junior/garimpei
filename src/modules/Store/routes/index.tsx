import StoreDetailPage from "../pages/StoreDatailPage";
import StorePage from "../pages/Stores";

export const ProducerRoutes = [
  {
    path: "",
    element: <StorePage />,
  },
  {
    path: ":id",
    element: <StoreDetailPage />,
  },
];
