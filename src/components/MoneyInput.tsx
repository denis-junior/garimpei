import React, { useState } from "react";

interface MoneyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  label?: string;
}

const formatMoney = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const MoneyInput: React.FC<MoneyInputProps> = ({
  value = 0,
  onChange,
  placeholder = "R$ 0,00",
  label,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = Number(raw) / 100;
    setInternalValue(numeric);
    if (onChange) onChange(numeric);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type="text"
        inputMode="numeric"
        value={formatMoney(internalValue)}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
      />
    </div>
  );
};

export default MoneyInput;
