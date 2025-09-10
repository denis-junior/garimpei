import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type FormDataLogin = yup.InferType<typeof LoginSchema>;
