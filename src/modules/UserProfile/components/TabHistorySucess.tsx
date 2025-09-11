import React from "react";

import { useSindAuctionsWonByBuyer } from "../service/History";
import { formatCurrencyBR } from "@/utils/formatCurrencyBr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IProduct } from "@/modules/Product/types/product";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Eye, Store, Instagram, MapPin, CreditCard } from "lucide-react";
import BidsTimeline from "@/components/BidsTimeline";

const TabHistorySucess: React.FC = () => {
  const navigate = useNavigate();
  const [isUsersBids, setIsUsersBids] = React.useState(false);
  const [item, setItem] = React.useState<IProduct>();
  const { data } = useSindAuctionsWonByBuyer();

  const handleModalOpen = (item: IProduct) => {
    setIsUsersBids(true);
    setItem(item);
  };

  return (
    <>
      <div className="space-y-4">
        {data?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum leilão ganho encontrado.
            </p>
          </div>
        ) : (
          data?.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex">
                {/* Imagem do Produto */}
                <div className="w-32 h-32 items-center flex flex-shrink-0 relative overflow-hidden rounded-l-lg">
                  {item.images && item.images.length > 0 ? (
                    <>
                      {/* Background blur */}
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${item.images[0].url})`,
                          filter: "blur(10px)",
                          transform: "scale(1.1)",
                        }}
                      />
                      {/* Imagem principal */}
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-contain z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center ">
                      <Store className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Conteúdo do Card */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.name}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Store className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Loja:</span>
                            <span className="text-foreground">
                              {item.store.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Instagram className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Instagram:</span>
                            <a
                              href={`https://www.instagram.com/${item.store.instagram}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              @{item.store.instagram}
                            </a>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Endereço:</span>
                            <span className="text-foreground text-xs">
                              {item.store.address}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Contato:</span>
                            <a
                              href={`tel:${item.store.contact}`}
                              className="text-primary hover:text-primary/80 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.store.contact}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Valor Final
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          R$ {formatCurrencyBR(item.bids[0].bid)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModalOpen(item);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          Histórico
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/mercadoPago/${item.id}`);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          <CreditCard className="h-4 w-4" />
                          Pagar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Dialog open={isUsersBids} onOpenChange={setIsUsersBids}>
        <DialogContent className="max-h-screen overflow-y-auto max-w-4xl">
          <DialogHeader>
            <DialogTitle className="mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Histórico de Lances - {item?.name}
            </DialogTitle>
            <DialogDescription>
              <BidsTimeline
                bids={item?.bids || []}
                showWinnerHighlight={true}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TabHistorySucess;
