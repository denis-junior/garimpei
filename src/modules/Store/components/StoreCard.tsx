import React from "react";
import { IStore } from "../types/store";
import { useNavigate } from "react-router-dom";

interface StoresCardProps {
  store: IStore;
  compact?: boolean;
  children?: React.ReactNode;
}

const StoresCard: React.FC<StoresCardProps> = ({ store, children }) => {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/store/${store.id}`);
  }

  return (
    <div className="group flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
            {store.name}
          </h3>
        </div>

        {children}
      </div>
      <div className="p-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm line-clamp-2 px-4">
          {store.description || "Sem descrição disponível."}
        </p>
      </div>
      <button
        onClick={handleClick}
        className="w-full py-4 bg-teal-600 text-white"
      >
        ir para loja
      </button>
    </div>
  );
};

export default StoresCard;
