import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuction } from "../../../context/AuctionContext";
import CountdownTimer from "../../../components/CountdownTimer";
import BidForm from "../../../components/BidForm";
import {
  ChevronLeft,
  Clock,
  DollarSign,
  User,
  AlertCircle,
} from "lucide-react";

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAuction, currentUser } = useAuction();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const auction = getAuction(id || "");

  // Redirect if auction not found
  useEffect(() => {
    if (!auction) {
      navigate("/");
    }
  }, [auction, navigate]);

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 p-6 rounded-lg">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Auction Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The auction you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 inline mr-2" />
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    images,
    size,
    category,
    startingPrice,
    currentBid,
    endDate,
    bids,
  } = auction;

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Helper function to get bidder display name
  const getBidderName = (userId: string) => {
    if (userId === currentUser.id) {
      return "Você";
    }
    // Format: first letter + asterisks + last 2 digits of ID
    return `${currentUser.name.charAt(0)}******${userId.slice(-2)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-gray-600 hover:text-teal-600 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Voltar para Leilões
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-w-1 aspect-h-1 mb-3">
              <img
                src={images[selectedImage]}
                alt={title}
                className="w-full h-96 object-cover object-center rounded-lg"
              />

              <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white px-3 py-2 m-4 rounded-md">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <CountdownTimer endDate={endDate} />
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`cursor-pointer flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden ${
                      selectedImage === index
                        ? "border-teal-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${title} - view ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auction details */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                Tamanho: {size}
              </span>

              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {category}
              </span>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">Preço Inicial</div>
                <div className="font-medium">R${startingPrice}</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-800">
                  Lance atual
                </div>
                <div className="text-2xl font-bold text-teal-600">
                  R${currentBid}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Descrição
              </h2>
              <p className="text-gray-600">{description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Faça seu lance
              </h2>
              <BidForm auctionId={auction.id} currentBid={currentBid} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Histórico de Lances
              </h2>

              {bids.length === 0 ? (
                <p className="text-gray-500">
                  Nenhum lance ainda, seja o primeiro!
                </p>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {[...bids].reverse().map((bid) => (
                      <li key={bid.id} className="p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-800 font-medium">
                              {getBidderName(bid.userId)}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <span className="font-semibold text-teal-600 mr-3">
                              <DollarSign className="h-4 w-4 inline" />{" "}
                              {bid.amount}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(bid.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
