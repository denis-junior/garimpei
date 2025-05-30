import React from "react";

interface PrimaryButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
