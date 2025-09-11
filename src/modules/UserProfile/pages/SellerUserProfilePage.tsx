import React, { useState } from "react";
import { Edit } from "lucide-react";
import UserInfoForm from "../components/BuyerUserInfoForm";
import { formatPhoneNumber } from "../../../utils";
import { useUser } from "../../../hooks/useUser";
import { useGetSeller } from "../service/CRUD-user";

const SellerUserProfilePage: React.FC = () => {
  const { user: dataUser } = useUser();
  const { data: user } = useGetSeller(dataUser?.id || 0);
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
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerUserProfilePage;
