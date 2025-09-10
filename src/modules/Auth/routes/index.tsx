import LoginPage from "../pages/Login";
import RegisterBuyerPage from "../pages/RegisterBuyer";
import RegisterSellerPage from "../pages/RegisterSeller";

export const AuthRoutes = [
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register/buyer",
    element: <RegisterBuyerPage />,
  },
  {
    path: "register/seller",
    element: <RegisterSellerPage />,
  },
  {
    path: "*",
    element: <LoginPage />,
  },
  {
    path: "",
    element: <LoginPage />,
  },
];
