import React from "react";

import { concatDateTimeToDate, formatDate } from "@/utils/formatDate";
import { formatCurrencyBR } from "@/utils/formatCurrencyBr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IProduct } from "@/modules/Product/types/product";

import { Badge } from "@/components/ui/badge";
import { Eye, Store, Calendar, DollarSign } from "lucide-react";
import BidsTimeline from "@/components/BidsTimeline";
import { useHistoryAuctions } from "../service/History";

const BuyerHistoryAuction: React.FC<{
  isWinner?: boolean;
}> = ({ isWinner }) => {
  const [isUsersBids, setIsUsersBids] = React.useState(false);
  const [item, setItem] = React.useState<IProduct>();
  const { data: clothingData } = useHistoryAuctions(isWinner);
  const handleModalOpen = (item: IProduct) => {
    setIsUsersBids(true);
    setItem(item);
  };

  return (
    <div className="container bg-background rounded-md mx-auto px-4 py-8">
      <div className="space-y-4">
        {clothingData?.items?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum leilão concluído encontrado.
            </p>
          </div>
        ) : (
          clothingData?.items?.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Imagem do Produto */}
                <div className="w-full sm:w-32 h-48 sm:h-auto items-center flex flex-shrink-0 relative overflow-hidden rounded-t-lg sm:rounded-t-none sm:rounded-l-lg">
                  {item.images && item.images.length > 0 ? (
                    <>
                      {/* Background blur */}
                      <div
                        className="absolute  inset-0 bg-cover bg-center"
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
                        className="absolute  inset-0  object-contain z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Store className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {/* Conteúdo do Card */}
                <div className="flex-1 p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <h3 className="text-base lg:text-lg font-semibold text-foreground">
                          {item.name}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 mt-3 lg:mt-4">
                        <div className="space-y-2 lg:space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Store className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">Loja:</span>
                            <span className="text-foreground truncate">
                              {item.store.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">Lance Final:</span>
                            <span className="text-primary font-bold">
                              R$ {formatCurrencyBR(item.bids[0].bid)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 lg:space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">Início:</span>
                            <span className="text-foreground text-xs">
                              {formatDate(
                                concatDateTimeToDate(
                                  String(item.initial_date),
                                  item.initial_time
                                )
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">Término:</span>
                            <span className="text-foreground text-xs">
                              {formatDate(
                                concatDateTimeToDate(
                                  String(item.end_date),
                                  item.end_time
                                )
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModalOpen(item);
                            }}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Lances
                          </button>
                        </div>
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
        <DialogContent className="max-h-screen overflow-y-auto max-w-4xl w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="mb-4 flex items-center gap-2 text-base sm:text-lg">
              <Eye className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">
                Histórico de Lances - {item?.name}
              </span>
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
    </div>
  );
};

export default BuyerHistoryAuction;
