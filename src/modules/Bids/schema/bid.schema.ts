import * as yup from "yup";

export const bidSchema = yup.object().shape({
  clothing: yup.number().required("Clothing is required"),
  bid: yup
    .number()
    .required("Bid amount is required")
    .min(1, "Bid amount must be greater than 0")
    .typeError("Bid amount must be a number"),
});

export type BidFormData = yup.InferType<typeof bidSchema>;
