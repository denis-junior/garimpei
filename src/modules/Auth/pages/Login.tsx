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
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
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
          <p className="text-red-500 mt-2">Erro: {(error as Error).message}</p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
