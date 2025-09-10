import { useContext } from "react";
import { UserContext } from "../context/UserGlobalContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import FormLogin from "@/modules/Auth/components/FormLogin";

const UserSheet = () => {
  const { setIsLoginSheet, isLoginSheet } = useContext(UserContext)!;
  const pathname = window.location.pathname;
  pathname.replace(import.meta.env.VITE_API_BASE_URL, "");

  const handleCreateAccount = () => {
    setIsLoginSheet(false);
    window.location.href =
      "/auth/register/buyer?redirectUrl=" + pathname.replace(/\//g, "-");
  };

  return (
    <Sheet open={isLoginSheet} onOpenChange={setIsLoginSheet}>
      <SheetContent>
        <div className="px-2 py-8 space-y-4">
          <h2 className="text-lg font-semibold ">
            Faça login ou cadastre-se para continuar com o seu lance
          </h2>
          <FormLogin onLogin={() => setIsLoginSheet(false)} />

          <p
            className="text-center text-sm cursor-pointer"
            onClick={handleCreateAccount}
          >
            Criar Conta
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
