import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  initial_bid: yup.number().required("numero é obrigatório"),
  initial_date: yup.date().required("Initial date is required"),
  end_date: yup.date().required("End date is required"),
  size: yup.string().required("Size is required"),
});

export type ProductFormData = yup.InferType<typeof schema>;
