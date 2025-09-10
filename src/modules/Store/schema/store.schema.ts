import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  contact: yup.string().required("Contact is required"),
  instagram: yup.string().required("Instagram is required"),
  address: yup.string().required("Address is required"),
});

export type StoreFormData = yup.InferType<typeof schema>;
