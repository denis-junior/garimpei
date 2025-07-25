import React from "react";
import ChartEvolutionAllProductPerStore from "../components/ChartEvolutionAllProductPerStore";
import ChartEvolutionProduct from "../components/ChartEvolutionProduct";
import ChartGainStore from "../components/ChartGainStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabHistory from "../components/TabHistory";
const tabs = ["Metricas", "Leilões Finalizados"];
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
      <Tabs defaultValue="Metricas">
        <TabsList className="flex justify-center gap-2 bg-primary-50 py-7">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="capitalize px-4 py-2 border border-primary text-sm font-medium data-[state=active]:text-white data-[state=active]:bg-primary relative last:mr-0 transition-all duration-500 shadow-xs whitespace-nowrap"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Metricas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-1 md:col-span-2">
              <ChartEvolutionAllProductPerStore></ChartEvolutionAllProductPerStore>
            </div>
            <div className="col-span-1 md:col-span-2">
              <ChartEvolutionProduct></ChartEvolutionProduct>
            </div>
            <ChartGainStore></ChartGainStore>
          </div>
        </TabsContent>
        <TabsContent value="Leilões Finalizados">
          <TabHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSeller;
