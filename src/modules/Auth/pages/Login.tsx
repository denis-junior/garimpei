import React from "react";
import FormLogin from "../components/FormLogin";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Criar Conta
        </h2>
        <FormLogin />
      </div>
    </div>
  );
};

export default LoginPage;
