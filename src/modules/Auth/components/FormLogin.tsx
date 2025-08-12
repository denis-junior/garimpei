import React, { useState } from "react";
import { FormDataLogin, LoginSchema } from "../schema/Login.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useLogin } from "../service/Login.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

interface IPropsFormLogin {
  onLogin?: () => void;
}

interface AxiosError {
  response: {
    data: {
      message: string;
    };
  };
}

const FormLogin: React.FC<IPropsFormLogin> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataLogin>({
    resolver: yupResolver(LoginSchema),
  });

  const { mutate, isPending, isError, error } = useLogin({ onLogin });

  const handleLogin = (e: FormDataLogin) => {
    mutate(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="space-y-4 sm:space-y-6"
    >
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register("email")}
            className={`pl-10 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 ${
              errors.email
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-gray-300 focus-visible:ring-primary focus-visible:border-primary"
            } hover:border-gray-400`}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 flex items-center animate-in slide-in-from-top-1 duration-200">
            <span className="mr-1">⚠</span>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Senha
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className={`pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 ${
              errors.password
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-gray-300 focus-visible:ring-primary focus-visible:border-primary"
            } hover:border-gray-400`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 flex items-center animate-in slide-in-from-top-1 duration-200">
            <span className="mr-1">⚠</span>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium bg-primary hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      {/* Error Message */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro no login
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {(error as unknown as AxiosError)?.response?.data?.message ||
                  (error as Error)?.message ||
                  "Ocorreu um erro ao fazer login. Verifique suas credenciais e tente novamente."}
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default FormLogin;
