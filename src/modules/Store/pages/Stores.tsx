import React, { useState } from "react";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import StoreForm from "../components/StoreForm";
import { useGetAllStores, useDeleteStore } from "../services/CRUD-stores";
import StoresCard from "../components/StoreCard";
import { IStore } from "../types/store";
import ConfirmationModal from "../../../components/ConfirmationModal";
import PrimaryButton from "../../../components/PrimaryButton";
import PageHeader from "../../../components/PageHeader";
import { useCheckSeller } from "../../../utils/checkoSeller";

const StoresPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [itemDelete, setItemDelete] = useState<IStore>();
  const { data: listStores } = useGetAllStores({ page: 1 });
  const { mutate } = useDeleteStore();
  const checkSeller = useCheckSeller();

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const confirmDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    store: IStore
  ) => {
    e.stopPropagation();
    setItemDelete(store);
  };

  const handleDelete = () => {
    if (itemDelete) {
      mutate(itemDelete.id);
      cancelDelete();
    }
  };

  const cancelDelete = () => {
    setItemDelete(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {checkSeller && (
        <PageHeader
          title="Dashboard de lojas"
          subtitle="Crie e gerencie suas lojas."
          action={
            <PrimaryButton onClick={toggleCreateForm}>
              {showCreateForm ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Nova Loja
                </>
              )}
            </PrimaryButton>
          }
        />
      )}

      {showCreateForm && checkSeller && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Criar Nova Loja
          </h2>
          <StoreForm onSubmitSuccess={handleCreateSuccess} />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          lojas ({listStores?.length || 0})
        </h2>

        {!listStores?.length ? (
          <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma loja encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Você ainda não criou nenhuma loja. Clique no botão acima para
              começar.
            </p>
            <button
              onClick={toggleCreateForm}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crie sua primeira loja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listStores?.map((store) => (
              <div key={store.id} className="relative">
                <StoresCard store={store}>
                  {checkSeller && (
                    <div className=" flex ">
                      <button
                        className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-teal-600 hover:bg-opacity-100 transition-colors"
                        title="Edit auction"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => confirmDelete(e, store)}
                        className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-red-600 hover:bg-opacity-100 transition-colors"
                        title="Delete auction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </StoresCard>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {itemDelete && (
        <ConfirmationModal
          title="Excluir Loja"
          message="Tem certeza que deseja excluir esta loja? Esta ação não pode ser desfeita."
          onCancel={cancelDelete}
          onConfirm={handleDelete}
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
};

export default StoresPage;
