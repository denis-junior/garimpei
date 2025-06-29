import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { IUser } from "../types/User";

interface UserContextType {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  loading: boolean;
  logOut: () => void;
  isLoginSheet: boolean;
  setIsLoginSheet: Dispatch<SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoginSheet, setIsLoginSheet] = useState(false);

  const logOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.href = "/auth/login";
  };

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      setUser(JSON.parse(user));
      setLoading(false);
    }

    if (!user) {
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        logOut,
        isLoginSheet,
        setIsLoginSheet,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
