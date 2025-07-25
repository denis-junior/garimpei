import React from "react";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormDataRegister, RegisterSchema } from "../schema/Register.schema";
import { useRegisterBuyer } from "../hooks/useRegister";
import { SubmitHandler } from "react-hook-form";

const RegisterBuyerPage: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
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
  const { mutate } = useRegisterBuyer();

  const onSubmit: SubmitHandler<FormDataRegister> = (data) => {
    console.log("Form Data:", data);
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Criar Conta
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Nome</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Seu nome"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-600 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Email"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-600 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">CPF</label>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <InputMask mask="999.999.999-99" {...field}>
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="000.000.000-00"
                    />
                  )}
                </InputMask>
              )}
            />
            {errors.cpf && (
              <p className="text-red-600 text-xs">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Telefone</label>
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <InputMask mask="(99) 99999-9999" {...field}>
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="(00) 00000-0000"
                    />
                  )}
                </InputMask>
              )}
            />
            {errors.contact && (
              <p className="text-red-600 text-xs">{errors.contact.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Instagram
            </label>
            <Controller
              name="instagram"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <input
                  {...rest}
                  value={
                    value.startsWith("@")
                      ? value
                      : "@" + value.replace(/\s/g, "")
                  }
                  onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="@seuusuario"
                />
              )}
            />
            {errors.instagram && (
              <p className="text-red-600 text-xs">{errors.instagram.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Senha</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Crie uma senha"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-600 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Repetir Senha
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Repita a senha"
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            onClick={() => console.log(getValues())}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-800 transition-colors text-sm"
          >
            Registrar
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-4 text-center">
          Já tem uma conta?{" "}
          <a href="#" className="text-primary hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterBuyerPage;
