import { EStatus } from "@/enum";

export const constantStatus: { value: EStatus; label: string }[] = [
  { value: EStatus.waiting_payment, label: "Aguardando Pagamento" },
  { value: EStatus.ended, label: "Finalizado" },
  { value: EStatus.finished, label: "Concluído" },
  { value: EStatus.active, label: "Ativo" },
  { value: EStatus.auctioned, label: "Arrematado" },
  { value: EStatus.paid, label: "Pago" },
  { value: EStatus.programmed, label: "Programado" },
];
