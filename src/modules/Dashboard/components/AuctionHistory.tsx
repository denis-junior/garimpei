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
import { useGetClothingManage } from "../services";
import { EStatus } from "@/enum";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IFilterManage } from "../types";
import { constantStatus } from "@/core/status";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Store, Calendar, DollarSign, Activity } from "lucide-react";
import BidsTimeline from "@/components/BidsTimeline";
const AuctionHistory: React.FC = () => {
  const [isUsersBids, setIsUsersBids] = React.useState(false);
  const [item, setItem] = React.useState<IProduct>();
  const [filter, setFilter] = React.useState<IFilterManage>({});
  const { data: clothingData } = useGetClothingManage({ ...filter });
  const handleModalOpen = (item: IProduct) => {
    setIsUsersBids(true);
    setItem(item);
  };

  const getStatusVariant = (status: EStatus) => {
    switch (status) {
      case EStatus.active:
        return "default";
      case EStatus.finished:
        return "secondary";
      case EStatus.waiting_payment:
        return "destructive";
      case EStatus.paid:
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="container bg-background rounded-md mx-auto px-4 py-8 pt-4">
      <div className="flex justify-center gap-2 bg-primary-25 py-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="status">Data Inicial</Label>
          <Input
            type="date"
            value={filter.initialDate || ""}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                initialDate: e.target.value || undefined,
              }))
            }
            className={`w-[180px] px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary border-gray-300`}
            placeholder="Selecione a data inicial"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="status">Data Final</Label>
          <Input
            type="date"
            value={filter.endDate || ""}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                endDate: e.target.value || undefined,
              }))
            }
            className={`w-[180px] px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary border-gray-300`}
            placeholder="Selecione a data final"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="status">Status</Label>
          <Select
            onValueChange={(value) =>
              setFilter((prev) => {
                return {
                  ...prev,
                  status: value === "all" ? undefined : (value as EStatus),
                };
              })
            }
            value={filter.status || "all"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                {constantStatus.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {clothingData?.items?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum leilão encontrado com os filtros aplicados.
            </p>
          </div>
        ) : (
          clothingData?.items?.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex">
                {/* Imagem do Produto */}
                <div className="w-32 items-center flex  flex-shrink-0 relative overflow-hidden rounded-l-lg">
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
                        className="absolute h-32 w-32 inset-0  object-contain z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Store className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Loja:</span>
                            <span className="text-foreground">
                              {item.store.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Lance Final:</span>
                            <span className="text-primary font-bold">
                              R$ {formatCurrencyBR(item.bids[0]?.bid || 0)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
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
                            <Calendar className="h-4 w-4 text-muted-foreground" />
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

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Status:</span>
                            <Badge
                              variant={getStatusVariant(item.status)}
                              className="text-xs"
                            >
                              {constantStatus.find(
                                (status) => status.value === item.status
                              )?.label ||
                                item.status ||
                                "Indefinido"}
                            </Badge>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModalOpen(item);
                            }}
                            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
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
    </div>
  );
};

export default AuctionHistory;
