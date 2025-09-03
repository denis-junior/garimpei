import React, { useState } from "react";
import { Edit, ClipboardList, Clock } from "lucide-react";
import UserInfoForm from "../components/BuyerUserInfoForm";
import { auctionHistory } from "../../../mock/data";
import { formatPhoneNumber } from "../../../utils";
import { useUser } from "../../../hooks/useUser";
import { useGetSeller } from "../service/CRUD-user";
import TabHistory from "../../Dashboard/components/CompletedAuctions";
import {
  useGetConectSeller,
  useGetStatusSeller,
} from "@/modules/MercadoPago/services";
import { toast } from "react-toastify";

const SellerUserProfilePage: React.FC = () => {
  const { user: dataUser } = useUser();
  const { data: user } = useGetSeller(dataUser?.id || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const {
    data: statusData,
    refetch,
    isPending,
  } = useGetStatusSeller(user?.id || 0);
  const { mutateAsync: connect } = useGetConectSeller();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleConnect = async () => {
    const response = await connect(user?.id || 0);
    if (response.success) {
      const popup = window.open(
        response.link_conexao,
        "mercadopago-auth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.data.success) {
          console.log("✅ Conta conectada!");
          popup?.close();
          refetch();
        } else {
          console.error("❌ Erro:", event.data.message);
          alert(`Erro ao conectar: ${event.data.message}`);
        }
        window.removeEventListener("message", handleMessage);
      };

      window.addEventListener("message", handleMessage);
      return;
    }
    toast.error("Erro ao iniciar conexão com Mercado Pago");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>

              <button
                onClick={() => handleConnect()}
                disabled={statusData?.conectado}
                className="super-button mt-4 sm:mt-0 bg-slate-500"
              >
                <span>
                  {isPending
                    ? "Carregando..."
                    : statusData?.conectado
                    ? "Conectado"
                    : "conectar com o mercado pago"}
                </span>
              </button>

              {!isEditing && (
                <button
                  onClick={toggleEdit}
                  className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </button>
              )}
            </div>

            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("info")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "info"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                Informação Pessoal
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                Histórico de Leilões Finalizados
              </button>
            </div>

            <div className="py-6">
              {activeTab === "info" &&
                (isEditing && user ? (
                  <UserInfoForm user={user} onClose={toggleEdit} />
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Nome Completo
                      </h3>
                      <p className="mt-1 text-lg text-gray-800">{user?.name}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="mt-1 text-lg text-gray-800">
                        {user?.email}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Número
                      </h3>
                      <p className="mt-1 text-lg text-gray-800">
                        {formatPhoneNumber(user?.contact || "")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Instagram
                      </h3>
                      <p className="mt-1 text-lg text-gray-800">
                        {user?.instagram}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Resumo da Conta
                      </h3>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                          <ClipboardList className="h-8 w-8 text-purple-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-purple-800">
                              Leilões Criados
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                              {0}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center p-4 bg-primary-50 rounded-lg">
                          <Clock className="h-8 w-8 text-primary" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-primary-800">
                              Lances Dados
                            </p>
                            <p className="text-2xl font-bold text-primary">
                              {0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {activeTab === "history" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Seu Histórico de Leilões
                  </h2>

                  {auctionHistory.length === 0 ? (
                    <p className="text-gray-500">
                      Você ainda não participou de nenhum leilão.
                    </p>
                  ) : (
                    <TabHistory></TabHistory>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerUserProfilePage;
