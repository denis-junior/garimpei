import * as yup from "yup";
import { isValidCPF } from "../../../utils/validateCPF";

export const RegisterSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("is-valid-cpf", "CPF inválido", (value) => isValidCPF(value || "")),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .test("is-valid-phone", "Telefone inválido", (value) => {
      const digits = value?.replace(/\D/g, "") || "";
      return digits.length === 11;
    }),
  instagram: yup
    .string()
    .required("Instagram é obrigatório")
    .matches(
      /^@[\w.]+$/,
      "Instagram deve começar com '@' e não conter espaços"
    ),
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: yup
    .string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
  seller: yup.boolean().default(false),
});

export type FormDataRegister = yup.InferType<typeof RegisterSchema>;
