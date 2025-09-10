export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Regex para DDD + 5 dígitos + 4 dígitos
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber; // Retorna original se não bater o padrão
};