import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetStore } from "../services/CRUD-stores";
import { Plus, X } from "lucide-react";
import ProductForm from "../../Product/components/FormProduct";
import CardGeneralProduct from "../../Product/components/CardGeneralProduct";
import PrimaryButton from "../../../components/PrimaryButton";
import PageHeader from "../../../components/PageHeader";
import { checkSeller } from "../../../utils/checkoSeller";

const StoreDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: store } = useGetStore(Number(id));
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={store?.name || "Detalhes do produto"}
        subtitle={store?.description || "Crie e gerencie seus produtos."}
        action={
          <>
            {checkSeller() && (
              <PrimaryButton onClick={toggleCreateForm}>
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
              </PrimaryButton>
            )}
          </>
        }
      ></PageHeader>

      {showCreateForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Criar Nova Loja
          </h2>
          <ProductForm
            onSubmitSuccess={handleCreateSuccess}
            idStore={Number(id)}
          />
        </div>
      )}

      <CardGeneralProduct idStore={Number(id)} />
    </div>
  );
};

export default StoreDetailPage;
