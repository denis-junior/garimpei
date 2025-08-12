import React, { useEffect } from "react";
import MoneyInput from "../../../components/MoneyInput";
import { usePostBid } from "../services/CRUD-bids";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BidFormData, bidSchema } from "../schema/bid.schema";
import { useUser } from "@/hooks/useUser";

interface BidFormProps {
  productId: number;
  currentBid: number;
}

const BidForm: React.FC<BidFormProps> = ({ productId, currentBid }) => {
  const { user, setIsLoginSheet } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BidFormData>({
    resolver: yupResolver(bidSchema),
  });

  function incrementBid() {
    return reset({
      clothing: productId,
      bid: Number(currentBid) + 1,
    });
  }

  const { mutateAsync } = usePostBid(incrementBid);

  useEffect(() => {
    reset({
      clothing: productId,
      bid: Number(currentBid) + 1,
    });
  }, [currentBid, productId, reset]);

  const onSubmit = (data: BidFormData) => {
    if (!user) return setIsLoginSheet(true);
    mutateAsync({
      bid: data.bid,
      clothing: data.clothing,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="bidAmount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Seu Lance (R$)
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <Controller
            name="bid"
            control={control}
            render={({ field }) => (
              <MoneyInput
                {...field}
                label="Valor"
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
        </div>
        {errors.bid && (
          <p className="mt-2 text-sm text-red-600">{errors.bid.message}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Lance mínimo: R${(Number(currentBid) + 1).toFixed(2)}
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary-800 focus:ring-primary"
        }`}
      >
        {isSubmitting ? "Fazendo Lance..." : "Fazer Lance"}
      </button>
    </form>
  );
};

export default BidForm;
