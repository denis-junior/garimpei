import * as yup from "yup";

export const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  contact: yup.string().required("Contact is required"),
  instagram: yup.string().required("Instagram is required"),
  email: yup.string().required("EMail is required"),
});

export type UserShemaFormData = yup.InferType<typeof userSchema>;
