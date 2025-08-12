import React, { useState } from "react";
import FormLogin from "../components/FormLogin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gem } from "lucide-react";
import logoImg from "@/assets/logo.png";
import backgroundImg from "@/assets/backgroundAuth.png";

const LoginPage: React.FC = () => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay escuro para melhor contraste */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="w-full max-w-md animate-in fade-in-0 duration-500 relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8 animate-in slide-in-from-top-4 duration-700">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-lg">
            Bem-vindo ao Garimpei
          </h1>
          <p className="text-sm sm:text-base text-white/90 mt-2 drop-shadow-md">
            Sua plataforma de leilões online
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white animate-in slide-in-from-bottom-4 duration-700 delay-150 mx-2 sm:mx-0">
          <CardHeader className="space-y-1 pb-4 px-4 sm:px-6">
            {!logoError ? (
              <img
                src={logoImg}
                alt="Garimpei"
                className="h-12 sm:h-16 w-auto mx-auto mb-1 sm:mb-2 transition-transform hover:scale-105 duration-300 filter drop-shadow-2xl"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="bg-primary rounded-full p-2.5 sm:p-3 transition-transform hover:scale-105 duration-300 shadow-2xl">
                  <Gem className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
                </div>
              </div>
            )}
            <CardTitle className="text-xl sm:text-2xl font-semibold text-center text-gray-900">
              Entre em sua conta
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
              Digite suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <FormLogin />
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-4 sm:mt-6 text-center space-y-2 animate-in slide-in-from-bottom-4 duration-700 delay-300 px-2 sm:px-0">
          <p className="text-xs sm:text-sm text-white/90 drop-shadow-md">
            Não tem uma conta?{" "}
            <a
              href="/auth/register/buyer"
              className="text-white font-medium hover:text-white/80 transition-colors hover:underline drop-shadow-md"
            >
              Cadastre-se aqui
            </a>
          </p>
          <p className="text-xs text-white/80 drop-shadow-md">
            <a
              href="/forgot-password"
              className="hover:text-white transition-colors hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
