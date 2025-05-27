import { RouterProvider } from "react-router-dom";
import { AuctionProvider } from "./context/AuctionContext";
import AppRoutes from "./infra/routes";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./infra/reactQueryConfig";

function App() {
  return (
    <AuctionProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={AppRoutes} />
      </QueryClientProvider>
    </AuctionProvider>
  );
}

export default App;
