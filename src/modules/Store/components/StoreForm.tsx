import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StoreFormData, schema } from "../schema/store.schema";
import { usePostStore } from "../services/CRUD-stores";
import InputMask from "react-input-mask";

interface IStoreFormProps {
  onSubmitSuccess?: () => void;
}

const StoreForm: React.FC<IStoreFormProps> = ({ onSubmitSuccess }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      instagram: "@",
    },
  });

  const { mutate, isPending } = usePostStore({ onSubmitSuccess });

  const onSubmit = (data: StoreFormData) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nome
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Digite o nome"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descrição
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Descreva seu item ou serviço"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contato
        </label>
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
      </div>

      <div>
        <label
          htmlFor="instagram"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Instagram
        </label>
        <Controller
          name="instagram"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <input
              {...rest}
              value={
                value.startsWith("@") ? value : "@" + value.replace(/\s/g, "")
              }
              onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
              className="w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="@seuusuario"
            />
          )}
        />
        {errors.instagram && (
          <p className="mt-1 text-sm text-red-600">
            {errors.instagram.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Endereço
        </label>
        <input
          id="address"
          type="text"
          {...register("address")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Rua, número, bairro, cidade"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="w-full py-3 px-4 bg-primary text-white font-medium rounded-md shadow hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isPending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
};

export default StoreForm;
