import React from "react";
import MoneyInput from "../../../components/MoneyInput";
import { usePostBid } from "../services/CRUD-bids";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BidFormData, bidSchema } from "../schema/bid.schema";

interface BidFormProps {
  productId: number;
  currentBid: number;
}

const BidForm: React.FC<BidFormProps> = ({ productId, currentBid }) => {
  const { mutateAsync } = usePostBid();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BidFormData>({
    resolver: yupResolver(bidSchema),
    defaultValues: {
      clothing: productId,
      bid: Number(currentBid) + 1,
    },
  });

  const minBid = Number(currentBid) + 1;

  const onSubmit = (data: BidFormData) => {
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
        <p className="mt-2 text-sm text-gray-500">Lance mínimo: R${minBid}</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500"
        }`}
      >
        {isSubmitting ? "Fazendo Lance..." : "Fazer Lance"}
      </button>
    </form>
  );
};

export default BidForm;
