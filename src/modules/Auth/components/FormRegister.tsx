import React, { useState } from "react";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormDataRegister, RegisterSchema } from "../schema/Register.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Phone,
  CreditCard,
  Instagram,
} from "lucide-react";

interface IPropsFormRegister {
  onRegister: (data: FormDataRegister) => void;
  isPending?: boolean;
  isError?: boolean;
  error?: unknown;
  userType: "buyer" | "seller";
}

interface AxiosError {
  response: {
    data: {
      message: string;
    };
  };
}

const FormRegister: React.FC<IPropsFormRegister> = ({
  onRegister,
  isPending,
  isError,
  error,
  userType,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormDataRegister>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      name: "",
      cpf: "",
      contact: "",
      instagram: "@",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <form
      onSubmit={handleSubmit(onRegister)}
      className="space-y-4 sm:space-y-5"
    >
      {/* Nome Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nome Completo
        </Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                placeholder="Seu nome completo"
                className={`pl-10 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 ${
                  errors.name
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 focus-visible:ring-primary focus-visible:border-primary"
                } hover:border-gray-400`}
              />
            )}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 flex items-center animate-in slide-in-from-top-1 duration-200">
            <span className="mr-1">⚠</span>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="seu@email.com"
                className={`pl-10 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 focus-visible:ring-primary focus-visible:border-primary"
                } hover:border-gray-400`}
              />
            )}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 flex items-center animate-in slide-in-from-top-1 duration-200">
            <span className="mr-1">⚠</span>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* CPF Field */}
      <div className="space-y-2">
        <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
          CPF
        </Label>
        <div className="relative group">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <InputMask mask="999.999.999-99" {...field}>
                {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                  <Input
                    {...inputProps}
                    id="cpf"
                    placeholder="000.000.000-00"
                    className={`pl-10 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 ${
                      errors.cpf
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-gray-300 focus-visible:ring-primary focus-visible:border-primary"
                    } hover:border-gray-400`}
                  />
                )}
              </InputMask>
            )}
          />
        </div>
        {errors.cpf && (
          <p className="text-red-500 text-xs mt-1 flex items-center animate-in slide-in-from-top-1 duration-200">
            <span className="mr-1">⚠</span>
            {errors.cpf.message}
          </p>
        )}
      </div>

      {/* Telefone Field */}
      <div className="space-y-2">
        <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
          Telefone
        </Label>
        <div className="relative group">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Controller
            name="contact"
            control={control}
            render={({ field }) => (
              <InputMask mask="(99) 99999-9999" {...field}>
                {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                  <Input
                    {...inputProps}
                    id="contact"
                    placeholder="(00) 00000-0000"
                    className={`pl-10 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 ${
                      errors.contact
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-gray-300 focus-visible:ring-primary focus-visible:border-primary"
                    } hover:border-gray-400`}
                  />
                )}
              </InputMask>
            )}
          />
        </div>
        {errors.contact && (
          <p className="text-red-500 text-xs mt-1 flex items-center animate-in slide-in-from-top-1 duration-200">
            <span className="mr-1">⚠</span>
            {errors.contact.message}
          </p>
        )}
      </div>

      {/* Instagram Field */}
      <div className="space-y-2">
        <Label
          htmlFor="instagram"
          className="text-sm font-medium text-gray-700"
        >
          Instagram
        </Label>
        <div className="relative group">
          <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Controller
            name="instagram"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <Input
                {...rest}
                id="instagram"
                value={
                  value.startsWith("@") ? value : "@" + value.replace(/\s/g, "")
                }
                onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
                placeholder="@seuusuario"
                className={`pl-10 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 ${
                  errors.instagram
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 focus-visible:ring-primary focus-visible:border-primary"
                } hover:border-gray-400`}
              />
            )}
          />
        </div>
        {errors.instagram && (
          <p className="text-red-500 text-xs mt-1 flex items-center animate-in slide-in-from-top-1 duration-200">
            <span className="mr-1">⚠</span>
            {errors.instagram.message}
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
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha"
                className={`pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 ${
                  errors.password
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 focus-visible:ring-primary focus-visible:border-primary"
                } hover:border-gray-400`}
              />
            )}
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

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirmar Senha
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repita a senha"
                className={`pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 focus-visible:ring-primary focus-visible:border-primary"
                } hover:border-gray-400`}
              />
            )}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1 flex items-center animate-in slide-in-from-top-1 duration-200">
            <span className="mr-1">⚠</span>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium bg-primary hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 mt-6"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          `Registrar como ${userType === "buyer" ? "Comprador" : "Vendedor"}`
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
                Erro no registro
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {(error as unknown as AxiosError)?.response?.data?.message ||
                  (error as Error)?.message ||
                  "Ocorreu um erro ao criar a conta. Verifique os dados e tente novamente."}
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default FormRegister;
