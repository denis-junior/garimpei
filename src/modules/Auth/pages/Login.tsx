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

const LoginPage: React.FC = () => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-in fade-in-0 duration-500">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8 animate-in slide-in-from-top-4 duration-700">
          {!logoError ? (
            <img
              src={logoImg}
              alt="Garimpei"
              className="h-12 sm:h-16 w-auto mx-auto mb-3 sm:mb-4 transition-transform hover:scale-105 duration-300"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-primary rounded-full p-2.5 sm:p-3 transition-transform hover:scale-105 duration-300 shadow-lg">
                <Gem className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
              </div>
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Bem-vindo ao Garimpei
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Sua plataforma de leilões online
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-700 delay-150 mx-2 sm:mx-0">
          <CardHeader className="space-y-1 pb-4 px-4 sm:px-6">
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
          <p className="text-xs sm:text-sm text-gray-600">
            Não tem uma conta?{" "}
            <a
              href="/auth/register/buyer"
              className="text-primary font-medium hover:text-primary-700 transition-colors hover:underline"
            >
              Cadastre-se aqui
            </a>
          </p>
          <p className="text-xs text-gray-500">
            <a
              href="/forgot-password"
              className="hover:text-gray-700 transition-colors hover:underline"
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
