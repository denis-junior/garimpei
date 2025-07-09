import React from "react";
import { FormDataLogin, LoginSchema } from "../schema/Login.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useLogin } from "../service/Login.service";

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

  return (
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
        disabled={isPending}
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
      {isError && (
        <p className="text-red-500 mt-2">
          Erro:{" "}
          {(error as unknown as AxiosError)?.response?.data?.message ||
            (error as Error)?.message ||
            "Ocorreu um erro ao fazer login."}
        </p>
      )}
    </form>
  );
};

export default FormLogin;
