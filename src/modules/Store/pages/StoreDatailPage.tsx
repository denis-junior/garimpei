import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetStore } from "../services/CRUD-stores";
import { Plus, X } from "lucide-react";

const StoreDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: store } = useGetStore(id || "");
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {store?.name}
          </h1>
          <p className="text-gray-600">{store?.description}</p>
        </div>

        <button className="mt-4 md:mt-0 flex items-center px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
          {showCreateForm ? (
            <>
              <X className="w-5 h-5 mr-2" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Criar novo produto
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StoreDetailPage;
