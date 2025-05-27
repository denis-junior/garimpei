import React, { useState } from "react";
// import { useAuction } from '../context/AuctionContext';
import { useAuction } from "../../../context/AuctionContext";
import AuctionForm from "../../../components/AuctionForm";
import AuctionCard from "../../../components/AuctionCard";
import { Plus, X, Edit, Trash2 } from "lucide-react";

const ProducerPage: React.FC = () => {
  const { getUserAuctions, deleteAuction } = useAuction();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingAuctionId, setDeletingAuctionId] = useState<string | null>(
    null
  );

  const userAuctions = getUserAuctions();

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const confirmDelete = (auctionId: string) => {
    setDeletingAuctionId(auctionId);
  };

  const handleDelete = () => {
    if (deletingAuctionId) {
      deleteAuction(deletingAuctionId);
      setDeletingAuctionId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingAuctionId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard do Vendedor
          </h1>
          <p className="text-gray-600">Crie e gerencie seus leilões.</p>
        </div>

        <button
          onClick={toggleCreateForm}
          className="mt-4 md:mt-0 flex items-center px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          {showCreateForm ? (
            <>
              <X className="w-5 h-5 mr-2" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Criar Novo Leilão
            </>
          )}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Criar Novo Leilão
          </h2>
          <AuctionForm onSubmitSuccess={handleCreateSuccess} />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Auctions ({userAuctions.length})
        </h2>

        {userAuctions.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum leilão ainda
            </h3>
            <p className="text-gray-500 mb-4">
              Você ainda não criou nenhum leilão. Clique no botão acima para
              começar.
            </p>
            <button
              onClick={toggleCreateForm}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crie seu primeiro leilão
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAuctions.map((auction) => (
              <div key={auction.id} className="relative">
                <AuctionCard auction={auction} compact={true} />

                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-teal-600 hover:bg-opacity-100 transition-colors"
                    title="Edit auction"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => confirmDelete(auction.id)}
                    className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-red-600 hover:bg-opacity-100 transition-colors"
                    title="Delete auction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deletingAuctionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Delete Auction
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this auction? This action cannot
              be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProducerPage;
