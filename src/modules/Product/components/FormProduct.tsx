import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductFormData, schema } from "../schema/product.schema";
import { usePostProductWithImage } from "../services/CRUD-product";
interface IProductFormProps {
  onSubmitSuccess?: () => void;
  idStore?: number;
}

const ProductForm: React.FC<IProductFormProps> = ({
  onSubmitSuccess,
  idStore,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      store: idStore,
    },
  });

  const { mutate, isPending } = usePostProductWithImage({ onSubmitSuccess });

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("initial_bid", String(data.initial_bid));
    formData.append("initial_date", data.initial_date);
    formData.append("end_date", data.end_date);
    formData.append("size", data.size);
    formData.append("store", String(data.store));
    if (data.image && data.image.length > 0) {
      Array.from(data.image).forEach((file) => {
        formData.append("images", file);
      });
    }
    mutate(formData, { onSuccess: () => reset() });
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
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
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
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Descreva o produto"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="initial_bid"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Lance inicial
        </label>
        <input
          id="initial_bid"
          type="number"
          step="0.01"
          {...register("initial_bid")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            errors.initial_bid ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Valor inicial"
        />
        {errors.initial_bid && (
          <p className="mt-1 text-sm text-red-600">
            {errors.initial_bid.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="initial_date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Data de início
        </label>
        <input
          id="initial_date"
          type="date"
          {...register("initial_date")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            errors.initial_date ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.initial_date && (
          <p className="mt-1 text-sm text-red-600">
            {errors.initial_date.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="end_date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Data de encerramento
        </label>
        <input
          id="end_date"
          type="date"
          {...register("end_date")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            errors.end_date ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.end_date && (
          <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="size"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tamanho
        </label>
        <input
          id="size"
          type="text"
          {...register("size")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            errors.size ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: M, G, GG, etc."
        />
        {errors.size && (
          <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Imagens do produto
        </label>
        <input
          id="image"
          type="file"
          multiple
          accept="image/*"
          {...register("image")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            errors.image ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">
            {errors.image.message as string}
          </p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="w-full py-3 px-4 bg-teal-600 text-white font-medium rounded-md shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isPending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
