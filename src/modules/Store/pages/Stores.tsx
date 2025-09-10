import React, { useState } from "react";
import { Plus, X, Edit, Trash2, Search } from "lucide-react";
import StoreForm from "../components/StoreForm";
import { useGetAllStores, useDeleteStore } from "../services/CRUD-stores";
import StoresCard from "../components/StoreCard";
import { IStore } from "../types/store";
import ConfirmationModal from "../../../components/ConfirmationModal";
import PrimaryButton from "../../../components/PrimaryButton";
import PageHeader from "../../../components/PageHeader";
import { useCheckSeller } from "../../../utils/checkoSeller";
import { useDebounce } from "@/hooks/useDebounce";

const StoresPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [editingStore, setEditingStore] = useState<IStore | null>(null);
  const [itemDelete, setItemDelete] = useState<IStore>();
  const debouncedSearchFilter = useDebounce(searchFilter, 500);
  const { data: listStores } = useGetAllStores({
    page: 1,
    searchFilter: debouncedSearchFilter,
  });
  const { mutate } = useDeleteStore();
  const checkSeller = useCheckSeller();

  const toggleCreateForm = () => {
    if (showEditForm) {
      setShowEditForm(false);
      setEditingStore(null);
    } else {
      setShowCreateForm(!showCreateForm);
    }
  };

  const toggleEditForm = (store?: IStore) => {
    if (store) {
      setEditingStore(store);
      setShowEditForm(true);
      setShowCreateForm(false);
    } else {
      setShowEditForm(false);
      setEditingStore(null);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setEditingStore(null);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {checkSeller && (
        <PageHeader
          title="Gerenciamento de suas lojas"
          subtitle="Crie e gerencie suas lojas."
          action={
            <PrimaryButton onClick={toggleCreateForm}>
              {showCreateForm || showEditForm ? (
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

      {showEditForm && editingStore && checkSeller && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Editar Loja: {editingStore.name}
            </h2>
            <button
              onClick={() => toggleEditForm()}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <StoreForm
            initialData={editingStore}
            isEditMode={true}
            onSubmitSuccess={handleEditSuccess}
          />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          lojas ({listStores?.length || 0})
        </h2>
        <div className="mb-6 relative">
          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={handleSearch}
              placeholder="Pesquisar pelo nome ou descrição de uma loja"
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {!listStores?.length ? (
          <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma loja encontrada
            </h3>
            {checkSeller && (
              <p className="text-gray-500 mb-4">
                Você ainda não criou nenhuma loja. Clique no botão acima para
                começar.
              </p>
            )}
            {checkSeller && (
              <button
                onClick={toggleCreateForm}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-800 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crie sua primeira loja
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listStores?.map((store) => (
              <div key={store.id} className="relative">
                <StoresCard store={store}>
                  {checkSeller && (
                    <div className=" flex ">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEditForm(store);
                        }}
                        className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-primary hover:bg-opacity-100 transition-colors"
                        title="Edit store"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => confirmDelete(e, store)}
                        className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-red-600 hover:bg-opacity-100 transition-colors"
                        title="Delete store"
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
