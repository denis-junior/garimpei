import React, { useEffect } from "react";

import { useGetAllProduct } from "../../Product/services/CRUD-product";
import ProductCard from "../../Home/components/cardProduct";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Loader from "@/components/Loader";
import { useSSE } from "@/hooks/useSSE";
import { IBid } from "@/modules/Bids/Types";
import { IProduct } from "@/modules/Product/types/product";
// import { Search } from "lucide-react";

const HomeViewerPage: React.FC = () => {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const [searchTerm, setSearchTerm] = useState("");

  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetAllProduct();
  const { observerRef } = useInfiniteScroll({
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
    onLoadMore: () => fetchNextPage(),
  });
  const [attBids, setAttBids] = React.useState<
    { bid: IBid; clothingId: number } | undefined
  >();

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

  const [products, setProducts] = React.useState<IProduct[]>([]);

  useEffect(() => {
    const allItems: IProduct[] =
      productsData?.pages.flatMap((page) => page.items) ?? [];

    setProducts(
      productsData
        ? allItems.map((item) => {
            const updatedBids =
              attBids?.bid &&
              !item?.bids.some((b) => b.id === attBids?.bid?.id) &&
              item.id === attBids?.clothingId
                ? [...item.bids, attBids?.bid]
                : item?.bids;
            return {
              ...item,
              bids: updatedBids,
            };
          })
        : []
    );
  }, [productsData, attBids, connected]);

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Encontre peças de moda exclusivas
        </h1>
        <p className="text-gray-600">
          Navegue pela nossa seleção criteriosa seleção de roupas vintage e de
          grife disponíveis para leilão.
        </p>
      </div>
      {/* <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Pesquisar por itens de vestuário..."
            className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div> */}

      {products.length === 0 ? (
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {isLoading && <Loader />}
      <div ref={observerRef} className="h-1 mt-10"></div>
    </div>
  );
};

export default HomeViewerPage;
