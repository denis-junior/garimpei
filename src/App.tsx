import { RouterProvider } from "react-router-dom";
import { AuctionProvider } from "./context/AuctionContext";
import AppRoutes from "./infra/routes";

function App() {
  return (
    <AuctionProvider>
      <RouterProvider router={AppRoutes} />
    </AuctionProvider>
  );
}

export default App;
