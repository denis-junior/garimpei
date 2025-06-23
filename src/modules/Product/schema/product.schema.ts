import * as yup from "yup";

export const schema = yup.object().shape({
  store: yup.number().required("Loja é obrigatória"),
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  initial_bid: yup
    .number()
    .typeError("Lance inicial deve ser um número")
    .required("Lance inicial é obrigatório"),
  initial_date: yup.string().required("Data de início é obrigatória"),
  end_date: yup.string().required("Data de encerramento é obrigatória"),
  size: yup.string().required("Tamanho é obrigatório"),
  image: yup
    .mixed<FileList>()
    .test("fileSize", "Cada arquivo deve ter menos de 5MB", (value) => {
      if (!value) return true;
      return Array.from(value).every((file) => file.size <= 5 * 1024 * 1024);
    })
    .required(),
  initial_time: yup.string().required("Hora de início é obrigatória"),
  end_time: yup.string().required("Hora de encerramento é obrigatória"),
});

export type ProductFormData = yup.InferType<typeof schema>;
