import React, { useState, useEffect } from "react";
import { useAuction } from "../context/AuctionContext";
import { Auction } from "../types";
import AuctionCard from "../components/AuctionCard";
import FilterBar from "../components/FilterBar";
import { Search } from "lucide-react";
import axios from "axios";
import CountdownTimer from "../components/CountdownTimer";

const AuctionViewerPage: React.FC = () => {
  const { auctions } = useAuction();
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    size: "",
    category: "",
    price: "",
  });
  const [endDateTest, setEndDateTest] = useState<{
    end_date: string;
    isActive: boolean;
    timeRemaining: number;
  }>();

  // Initialize with all active auctions
  useEffect(() => {
    setFilteredAuctions(
      auctions.filter((auction) => auction.status === "active")
    );
  }, [auctions]);

  // Apply filters and search
  useEffect(() => {
    let filtered = auctions.filter((auction) => auction.status === "active");

    const getDate = async () => {
      const result = await axios.get(
        "http://localhost:3000/clothing/2/time-remaining"
      );
      console.log(result.data);
      setEndDateTest(result.data);
    };

    getDate();

    // get auctions from API
    // const getAuctions = async () => {
    //   const result = await axios.get("http://localhost:3000/clothing");
    //   console.log(result.data);
    //   setFilteredAuctions(result.data);
    // };
    // getAuctions();


    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (auction) =>
          auction.title.toLowerCase().includes(term) ||
          auction.description.toLowerCase().includes(term)
      );
    }

    // Apply size filter
    if (activeFilters.size) {
      filtered = filtered.filter(
        (auction) => auction.size === activeFilters.size
      );
    }

    // Apply category filter
    if (activeFilters.category) {
      filtered = filtered.filter(
        (auction) => auction.category === activeFilters.category
      );
    }

    // Apply price filter
    if (activeFilters.price) {
      const [min, max] = activeFilters.price.split("-").map(Number);
      if (max) {
        filtered = filtered.filter(
          (auction) => auction.currentBid >= min && auction.currentBid <= max
        );
      } else {
        filtered = filtered.filter((auction) => auction.currentBid >= min);
      }
    }

    setFilteredAuctions(filtered);
  }, [auctions, searchTerm, activeFilters]);

  const handleFilterChange = (filters: Record<string, string>) => {
    setActiveFilters({
      size: filters.size ?? "",
      category: filters.category ?? "",
      price: filters.price ?? "",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
      <CountdownTimer endDate={endDateTest?.end_date ?? ""} />
      <div className="mb-6 relative">
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
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {filteredAuctions.length === 0 ? (
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
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionViewerPage;
