import { useUser } from "@/hooks/useUser";

export const useCheckSeller = () => {
  const { user } = useUser();
  if (user && user.seller) {
    return true;
  }
  return false;
};
