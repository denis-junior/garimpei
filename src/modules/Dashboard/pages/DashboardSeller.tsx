import React from "react";
import ChartEvolutionAllProductPerStore from "../components/ChartEvolutionAllProductPerStore";
import ChartEvolutionProduct from "../components/ChartEvolutionProduct";
import ChartGainStore from "../components/ChartGainStore";

const DashboardSeller: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Dashboard das suas vendas
        </h1>
        <p className="text-gray-600">
          Acompanhe o desempenho das suas vendas, lances e produtos em tempo
          real.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2">
          <ChartEvolutionAllProductPerStore></ChartEvolutionAllProductPerStore>
        </div>
        <div className="col-span-1 md:col-span-2">
          <ChartEvolutionProduct></ChartEvolutionProduct>
        </div>
        <ChartGainStore></ChartGainStore>
      </div>
    </div>
  );
};

export default DashboardSeller;
