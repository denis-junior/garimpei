import LoginPage from "../pages/Login";
import Register from "../pages/Register";

export const AuthRoutes = [
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <Register />,
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
