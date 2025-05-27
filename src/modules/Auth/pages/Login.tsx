import React from "react";
import { useLogin } from "../hooks/useLogin";
import { FormDataLogin, LoginSchema } from "../schema/Login.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataLogin>({
    resolver: yupResolver(LoginSchema),
  });

  const { mutate, isPending, isError, error } = useLogin();
  const handleLogin = (e: FormDataLogin) => {
    mutate(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Criar Conta
        </h2>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border p-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Senha</label>
            <input
              type="password"
              {...register("password")}
              className="w-full border p-2 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>

          {isError && (
            <p className="text-red-500 mt-2">
              Erro: {(error as Error).message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
