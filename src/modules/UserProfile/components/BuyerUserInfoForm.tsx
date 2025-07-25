import React from "react";
import { IUser } from "../../../types/User";
import { useForm } from "react-hook-form";
import { usePutBuyer } from "../service/CRUD-user";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema, UserShemaFormData } from "../schema/user.schema";

interface BuyerUserInfoFormProps {
  user: IUser;
  onClose?: () => void;
}

const BuyerUserInfoForm: React.FC<BuyerUserInfoFormProps> = ({
  user,
  onClose,
}) => {
  const { mutate: updateBuyer } = usePutBuyer();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserShemaFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: user.name,
      contact: user.contact || "",
      instagram: user.instagram || "",
      email: user.email || "",
    },
  });

  const onSubmit = (data: UserShemaFormData) => {
    updateBuyer(
      { id: user?.id || 0, data },
      {
        onSuccess: () => onClose && onClose(),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="number"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Número
        </label>
        <input
          type="text"
          id="number"
          placeholder="(XX) XXXXX-XXXX"
          {...register("contact")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
            errors.contact ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.contact && (
          <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="instagram"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Instagram
        </label>
        <input
          type="text"
          id="instagram"
          placeholder="meu_usuario"
          {...register("instagram")}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
            errors.instagram ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.instagram && (
          <p className="mt-1 text-sm text-red-600">
            {errors.instagram.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default BuyerUserInfoForm;
