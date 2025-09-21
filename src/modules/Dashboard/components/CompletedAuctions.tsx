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
import {
  useGetClothingManage,
  usePostForceNextBidder,
  usePostMarkPaid,
} from "../services";
import { EStatus } from "@/enum";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Store,
  Calendar,
  DollarSign,
  CheckCircle,
  UserX,
  Crown,
  Instagram,
  Phone,
} from "lucide-react";
import BidsTimeline from "@/components/BidsTimeline";

const CompletedAuctions: React.FC = () => {
  const [isUsersBids, setIsUsersBids] = React.useState(false);
  const [isWinnerBids, setIsWinnerBids] = React.useState(false);
  const [item, setItem] = React.useState<IProduct>();
  const { mutate: markPaid } = usePostMarkPaid();
  const { mutate: forceNextBidder } = usePostForceNextBidder();
  const { data: clothingData } = useGetClothingManage({
    status: EStatus.waiting_payment,
  });
  const handleModalOpen = (item: IProduct) => {
    setIsUsersBids(true);
    setItem(item);
  };
  const handleWinnerModalOpen = (item: IProduct) => {
    setIsWinnerBids(true);
    setItem(item);
  };

  const winner = item?.bids.find((e) => e.id === item?.current_winner_bid_id);

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
                <div className="w-full lg:w-32 h-48 lg:h-32 items-center flex flex-shrink-0 relative overflow-hidden rounded-t-lg lg:rounded-t-none lg:rounded-l-lg">
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
                              handleWinnerModalOpen(item);
                            }}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
                          >
                            <Crown className="h-4 w-4" />
                            <span className="hidden sm:inline xl:inline">
                              Atual Vencedor
                            </span>
                            <span className="sm:hidden xl:hidden">
                              Vencedor
                            </span>
                          </button>

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

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              Pago e Entregue
                            </span>
                            <span className="sm:hidden">Entregue</span>
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[95vw] sm:w-full max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg">
                              Deseja realmente marcar como entregue?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                              Esta ação não pode ser desfeita. Isso irá marcar o
                              leilão como concluído e pago.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => markPaid(item.id)}
                            >
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
                            <UserX className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              Ganhador Ausente
                            </span>
                            <span className="sm:hidden">Ausente</span>
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[95vw] sm:w-full max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg">
                              Deseja realmente marcar como ganhador ausente?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                              O ganhador atual será considerado ausente e
                              perderá o direito ao item. O sistema selecionará
                              automaticamente o próximo da lista de lances.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => forceNextBidder(item.id)}
                            >
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isWinnerBids} onOpenChange={setIsWinnerBids}>
        <DialogContent className="max-h-screen overflow-y-auto max-w-2xl w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="mb-4 flex items-center gap-2 text-base sm:text-lg">
              <Crown className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <span className="truncate">
                Vencedor do Leilão - {item?.name}
              </span>
            </DialogTitle>
            <DialogDescription>
              {winner ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                      <Crown className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-green-800 mb-2">
                        {winner.buyer.name}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Instagram className="h-4 w-4 text-pink-500" />
                          <a
                            href={`https://instagram.com/${winner.buyer.instagram.replace(
                              /@/,
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-700 font-medium"
                          >
                            {winner.buyer.instagram}
                          </a>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-blue-500" />
                          <a
                            href={`tel:${winner.buyer.contact}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {winner.buyer.contact}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-green-200 pt-4">
                      <div className="text-sm text-green-700 mb-1">
                        Lance Vencedor
                      </div>
                      <div className="text-2xl font-bold text-green-800">
                        R$ {formatCurrencyBR(winner.bid)}
                      </div>
                    </div>

                    <div className="text-xs text-green-600">
                      {winner?.date
                        ? `Lance realizado em ${formatDate(
                            concatDateTimeToDate(
                              String(winner?.date),
                              winner?.time
                            )
                          )}`
                        : "Data do lance não informada"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Nenhum vencedor encontrado para este leilão.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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

export default CompletedAuctions;
