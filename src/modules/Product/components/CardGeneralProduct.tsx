import React from "react";
import { useGetAllProduct } from "../services/CRUD-product";
import ProductCard from "./CardProduct";

const CardGeneralProduct: React.FC = () => {
  const { data: products } = useGetAllProduct();

  return (
    <div className="container mx-auto px-4 py-8">
      {products?.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum Leilão Encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar seus filtros ou termos de pesquisa para encontrar o
            que você está procurando.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((products) => (
            <ProductCard key={products.id} product={products} actions />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardGeneralProduct;
