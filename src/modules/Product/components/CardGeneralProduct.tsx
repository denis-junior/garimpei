import React, { useEffect } from "react";
import ProductCard from "./CardProduct";
import { useGetStore } from "../../Store/services/CRUD-stores";
import { useSSE } from "@/hooks/useSSE";
import { IBid } from "@/modules/Bids/Types";
import { IProduct } from "../types/product";
interface ICardGeneralProductProps {
  idStore: number;
}
const CardGeneralProduct: React.FC<ICardGeneralProductProps> = ({
  idStore,
}) => {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { data: store } = useGetStore(idStore);
  const [attBids, setAttBids] = React.useState<
    { bid: IBid; clothingId: number } | undefined
  >();
  const [products, setProducts] = React.useState<IProduct[]>([]);

  const { connected } = useSSE<{ bid: IBid; clothingId: number }>(
    `${VITE_API_BASE_URL}bid/stream/all`,
    {
      onMessage: (data) => setAttBids(data),
      events: {
        "custom-event": (data) => console.log("Custom Event:", data),
      },
      autoReconnect: true,
      reconnectInterval: 5000,
      parse: true,
    }
  );

  useEffect(() => {
    const allItems: IProduct[] = store?.clothings || [];
    setProducts(
      store?.clothings
        ? allItems.map((item) => {
            const updatedBids =
              attBids?.bid &&
              !item?.bids?.some((b) => b.id === attBids?.bid?.id) &&
              item.id === attBids?.clothingId
                ? [...item.bids, attBids?.bid]
                : item.bids;
            return {
              ...item,
              bids: updatedBids,
            };
          })
        : []
    );
  }, [store, attBids, connected]);

  return (
    <div className="container mx-auto px-4 py-8">
      {store?.clothings?.length === 0 ? (
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
