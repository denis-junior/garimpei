import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CountdownTimer from "../../../components/CountdownTimer";
import BidForm from "../components/BidForm";
import { ChevronLeft, Clock, User, AlertCircle } from "lucide-react";
import { useGetProduct } from "../../Product/services/CRUD-product";
import { formatCurrencyBR } from "../../../utils/formatCurrencyBr";
import { concatDateTimeToDate } from "../../../utils/formatDate";
import { Buyer } from "@/modules/Product/types/product";
import { useSSE } from "@/hooks/useSSE";
import { IBid } from "../Types";
import { useCheckSeller } from "@/utils/checkoSeller";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import ImageModal from "@/components/ImageModal";

const BidProductPage: React.FC = () => {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProduct(id || "");
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  const checkoSeller = useCheckSeller();

  const [listBids, setListBids] = useState<IBid[]>([]);
  const previousMessagesLength = useRef(0);

  const { messages } = useSSE<{ bid: IBid; clothingId: number }>(
    `${VITE_API_BASE_URL}bid/stream/${id || ""}`,
    {
      events: {
        "custom-event": (data) => console.log("Custom Event:", data),
      },
      autoReconnect: true,
      reconnectInterval: 5000,
      parse: true,
    }
  );

  useEffect(() => {
    if (!product?.bids) return;

    const getBidderNameForToast = (buyer: Buyer) => {
      if (checkoSeller) return buyer?.name || "Anônimo";
      if (buyer?.id === currentUser?.id) {
        return "Você";
      }
      const name = buyer?.name;
      if (!name) return "Anônimo";
      if (name?.length <= 4) {
        return (
          name?.slice(0, 1) +
          "*".repeat(Math.max(0, name.length - 2)) +
          name?.slice(-1)
        );
      }
      return (
        name?.slice(0, 2) +
        "*".repeat(Math.max(0, name.length - 4)) +
        name?.slice(-2)
      );
    };

    let allBids: IBid[] = [];

    if (messages && messages.length > 0) {
      // Extrair novos lances do SSE
      const newBids = messages.map((m) => m.bid);

      // Verificar se há novos lances para mostrar toast
      if (messages.length > previousMessagesLength.current) {
        const latestMessage = messages[messages.length - 1];
        const latestBid = latestMessage.bid;

        // Verificar se o lance não é do usuário atual
        if (latestBid.buyer.id !== currentUser?.id) {
          const bidderName = getBidderNameForToast(latestBid.buyer);
          toast.success(
            `Novo lance! ${bidderName} ofereceu ${formatCurrencyBR(
              Number(latestBid.bid)
            )}`,
            {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }

        // Atualizar a referência do comprimento das mensagens
        previousMessagesLength.current = messages.length;
      }

      // Filtrar lances originais para remover duplicatas
      const originalBidsFiltered = product.bids.filter(
        (originalBid) => !newBids.some((newBid) => newBid.id === originalBid.id)
      );

      // Combinar todos os lances
      allBids = [...newBids, ...originalBidsFiltered];
    } else {
      // Se não há mensagens SSE, usar apenas os lances originais
      allBids = [...product.bids];
    }

    // Ordenar por valor do lance (maior para menor)
    allBids.sort((a, b) => Number(b.bid) - Number(a.bid));

    setListBids(allBids);
  }, [product, messages, currentUser?.id, checkoSeller]);

  if (!product) {
    if (isLoading)
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-yellow-50 p-6 rounded-lg">
            <Loader />;
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Carregando...
            </h2>
          </div>
        </div>
      );

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
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 inline mr-2" />
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleMainImageClick = () => {
    setIsImageModalOpen(true);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const getBidderName = (buyer: Buyer) => {
    if (checkoSeller) return buyer?.name || "Anônimo";
    if (buyer?.id === currentUser?.id) {
      return "Você";
    }
    const name = buyer?.name;
    if (!name) return "Anônimo";
    if (name?.length <= 4) {
      return (
        name?.slice(0, 1) +
        "*".repeat(Math.max(0, name.length - 2)) +
        name?.slice(-1)
      );
    }
    return name?.slice(0, 2) + "***" + name?.slice(-2);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image gallery */}
            <div>
              <div className="relative aspect-w-1 aspect-h-1 mb-3 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-sm scale-105"
                  style={{
                    backgroundImage: `url(${product.images[selectedImage].url})`,
                  }}
                />

                <div className="absolute inset-0 bg-black bg-opacity-20" />

                <img
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].url || "product Item"}
                  className="relative w-full h-96 object-contain object-center z-10 cursor-pointer transition-transform hover:scale-105"
                  onClick={handleMainImageClick}
                />

                <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white px-3 py-2 m-4 rounded-md z-20">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <CountdownTimer
                      endDate={concatDateTimeToDate(
                        String(product.end_date),
                        product.end_time
                      )}
                    />
                  </div>
                </div>
              </div>

              {product.images?.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageClick(index)}
                      className={`cursor-pointer flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden transition-all hover:scale-105 ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${image.url} - view ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Localização da Loja
                </h3>
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div className="text-sm text-gray-600">
                    {product.store?.address ? (
                      <>
                        <p>{product.store.address}</p>
                      </>
                    ) : (
                      <p className="text-gray-400">Localização não informada</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Auction details */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h1>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      Tamanho: {product.size}
                    </span>
                  </div>
                </div>
                <div
                  className="flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => navigate(`/store/${product.store?.id}`)}
                >
                  <h2 className="text-sm font-semibold text-gray-800 ">
                    Loja :
                  </h2>
                  <p className="text-gray-600">{product.store?.name}</p>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-500">Preço Inicial</div>
                  <div className="font-medium">R${product.initial_bid}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-800">
                    Lance atual
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    R$
                    {listBids?.[0]?.bid || product.initial_bid}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Descrição
                </h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Faça seu lance
                </h2>
                <BidForm
                  productId={product.id}
                  currentBid={listBids?.[0]?.bid || product.initial_bid}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Histórico de Lances
                </h2>

                {listBids?.length === 0 ? (
                  <p className="text-gray-500">
                    Nenhum lance ainda, seja o primeiro!
                  </p>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <ul className="divide-y divide-gray-200">
                      {listBids.map((bid, index) => (
                        <li key={index} className="p-3 hover:bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-800 font-medium">
                                {getBidderName(bid.buyer)}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <span className="font-semibold text-primary mr-3">
                                {formatCurrencyBR(Number(bid.bid))}
                              </span>
                              <span className="text-xs text-gray-500">
                                {concatDateTimeToDate(
                                  String(bid.date),
                                  String(bid.time)
                                ).toLocaleString()}
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

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={product.images[selectedImage].url}
        altText={product.name}
      />
    </>
  );
};

export default BidProductPage;
