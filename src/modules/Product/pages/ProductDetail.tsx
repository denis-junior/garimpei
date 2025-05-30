import React from "react";
import { useParams } from "react-router-dom";
import { useGetProduct } from "../services/CRUD-product";
import PageHeader from "../../../components/PageHeader";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useGetProduct(id || "");

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Carregando...</div>;
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">Produto não encontrado.</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={product.name} subtitle={product.description} />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Detalhes</h2>
        <p>
          <strong>Lance Inicial:</strong> R$ {product.initial_bid}
        </p>
        <p>
          <strong>Data de Início:</strong>{" "}
          {new Date(product.initial_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Data de Encerramento:</strong>{" "}
          {new Date(product.end_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Tamanho:</strong> {product.size}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Lances</h2>
        {product.bids.length === 0 ? (
          <p>Nenhum lance até o momento.</p>
        ) : (
          <ul className="space-y-4">
            {product.bids.map((bid) => (
              <li key={bid.id} className="p-4 border rounded-lg shadow">
                <p>
                  <strong>Valor:</strong> R$ {bid.bid}
                </p>
                <p>
                  <strong>Comprador:</strong> {bid.buyer.name}
                </p>
                <p>
                  <strong>Instagram:</strong> @{bid.buyer.instagram}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Data:</strong> {new Date(bid.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
