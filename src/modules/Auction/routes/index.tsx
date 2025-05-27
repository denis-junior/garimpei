import AuctionViewerPage from "../pages/AuctionViewerPage";
import AuctionDetailPage from "../pages/AuctionDetailPage";

export const AuctionRoutes = [
  {
    path: "",
    element: <AuctionViewerPage />,
  },
  {
    path: ":id",
    element: <AuctionDetailPage />,
  },
];
