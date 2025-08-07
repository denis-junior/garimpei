import React from "react";

interface PrimaryButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={(e) => onClick && onClick(e)}
      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
