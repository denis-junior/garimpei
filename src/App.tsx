import { RouterProvider } from "react-router-dom";
import { AuctionProvider } from "./context/AuctionContext";
import AppRoutes from "./infra/routes";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./infra/reactQueryConfig";
import { UserProvider } from "./context/UserGlobalContext";

function App() {
  return (
    <AuctionProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RouterProvider router={AppRoutes} />
        </UserProvider>
      </QueryClientProvider>
    </AuctionProvider>
  );
}

export default App;
