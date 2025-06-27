import React, { useEffect, useRef, useState } from "react";
// import { useAuction } from "../../../context/AuctionContext";
// import { Auction } from "../../../types";
// import AuctionCard from "../../../components/AuctionCard";
// import FilterBar from "../../../components/FilterBar";
// import { Search } from "lucide-react";
import { useSSE } from "../../../hooks/useSSE";
import { useGetAllProduct } from "../../Product/services/CRUD-product";
import ProductCard from "../../Home/components/cardProduct";
import { IProduct } from "@/modules/Product/types/product";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const HomeViewerPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: productsData } = useGetAllProduct({ page });
  const { items: products, lastElementRef } = useInfiniteScroll<IProduct>({
    data: productsData ?? [],
    hasMore: true,
    setPage,
  });

  // useEffect(() => {
  //   const loadProducts = async () => {
  //     if (!hasMore && productsData?.length) return;
  //     setProducts((prev) => [...prev, ...(productsData ?? [])]);
  //     setHasMore(true);
  //   };

  //   loadProducts();
  // }, [page, productsData]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         console.log("Observer triggered, loading more products...");
  //         setPage((prev) => prev + 1);
  //       }
  //     },
  //     { threshold: 1 }
  //   );

  //   if (observerRef.current) observer.observe(observerRef.current);

  //   return () => {
  //     if (observerRef.current) observer.unobserve(observerRef.current);
  //   };
  // }, [hasMore]);

  // const { connected, messages } = useSSE<{ text: string; id: number }>(
  //   "http://localhost:3000/bid/stream",
  //   {
  //     onMessage: (data) => console.log("Recebido:", data),
  //     events: {
  //       "custom-event": (data) => console.log("Custom Event:", data),
  //     },
  //     autoReconnect: true,
  //     reconnectInterval: 5000,
  //     parse: true,
  //   }
  // );
  // const { auctions } = useAuction();
  // const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [activeFilters, setActiveFilters] = useState({
  //   size: "",
  //   category: "",
  //   price: "",
  // });

  // Initialize with all active auctions
  // useEffect(() => {
  //   setFilteredAuctions(
  //     auctions.filter((auction) => auction.status === "active")
  //   );
  // }, [auctions]);

  // Apply filters and search
  // useEffect(() => {
  //   let filtered = auctions.filter((auction) => auction.status === "active");

  //   // Apply search term
  //   if (searchTerm) {
  //     const term = searchTerm.toLowerCase();
  //     filtered = filtered.filter(
  //       (auction) =>
  //         auction.title.toLowerCase().includes(term) ||
  //         auction.description.toLowerCase().includes(term)
  //     );
  //   }

  //   // Apply size filter
  //   if (activeFilters.size) {
  //     filtered = filtered.filter(
  //       (auction) => auction.size === activeFilters.size
  //     );
  //   }

  //   // Apply category filter
  //   if (activeFilters.category) {
  //     filtered = filtered.filter(
  //       (auction) => auction.category === activeFilters.category
  //     );
  //   }

  //   // Apply price filter
  //   if (activeFilters.price) {
  //     const [min, max] = activeFilters.price.split("-").map(Number);
  //     if (max) {
  //       filtered = filtered.filter(
  //         (auction) => auction.currentBid >= min && auction.currentBid <= max
  //       );
  //     } else {
  //       filtered = filtered.filter((auction) => auction.currentBid >= min);
  //     }
  //   }

  //   setFilteredAuctions(filtered);
  // }, [auctions, searchTerm, activeFilters]);

  // const handleFilterChange = (filters: Record<string, string>) => {
  //   setActiveFilters({
  //     size: filters.size ?? "",
  //     category: filters.category ?? "",
  //     price: filters.price ?? "",
  //   });
  // };

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
            className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div> */}

      {/* <FilterBar onFilterChange={handleFilterChange} /> */}

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
          {products?.map((product) => (
            <>
              <ProductCard key={product.id} product={product} />
            </>
          ))}
        </div>
      )}
      <div ref={lastElementRef} className="h-1 mt-2"></div>
    </div>
  );
};

export default HomeViewerPage;
