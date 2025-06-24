import React, { useState } from "react";
import { Edit, ClipboardList, Clock } from "lucide-react";
import UserInfoForm from "../components/BuyerUserInfoForm";
import { auctionHistory } from "../../../mock/data";
import { formatPhoneNumber } from "../../../utils";
import { useUser } from "../../../hooks/useUser";
import { useGetBuyer } from "../service/CRUD-user";

const BuyerUserProfilePage: React.FC = () => {
  const { user: dataUser } = useUser();
  const { data: user } = useGetBuyer(dataUser?.id || 0);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
              {!isEditing && (
                <button
                  onClick={toggleEdit}
                  className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-md hover:bg-teal-100 transition-colors"
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
                    ? "text-teal-600 border-b-2 border-teal-500"
                    : "text-gray-500 hover:text-teal-500"
                }`}
              >
                Informação Pessoal
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "text-teal-600 border-b-2 border-teal-500"
                    : "text-gray-500 hover:text-teal-500"
                }`}
              >
                Histórico de Leilões
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "preferences"
                    ? "text-teal-600 border-b-2 border-teal-500"
                    : "text-gray-500 hover:text-teal-500"
                }`}
              >
                Preferencias
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

                        <div className="flex items-center p-4 bg-teal-50 rounded-lg">
                          <Clock className="h-8 w-8 text-teal-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-teal-800">
                              Lances Dados
                            </p>
                            <p className="text-2xl font-bold text-teal-600">
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
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Preço
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {auctionHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.role === "seller"
                                    ? "Você vendeu"
                                    : "Você deu um lance"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  R${item.finalPrice}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {new Date(item.date).toLocaleDateString(
                                    "en-GB"
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    item.status === "vendido"
                                      ? "bg-green-100 text-green-800"
                                      : item.status === "ganhou"
                                      ? "bg-teal-100 text-teal-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {item.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "preferences" ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Your Preferences
                  </h2>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerUserProfilePage;
