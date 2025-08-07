import React from "react";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
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
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { cn } from "@/lib/utils";
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
const AuctionHistory: React.FC = () => {
  const [isUsersBids, setIsUsersBids] = React.useState(false);
  const [item, setItem] = React.useState<IProduct>();
  const [filter, setFilter] = React.useState<IFilterManage>({});
  const { data: clothingData } = useGetClothingManage({ ...filter });
  const handleModalOpen = (item: IProduct) => {
    setIsUsersBids(true);
    setItem(item);
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Loja</TableHead>
            <TableHead>Lance Final</TableHead>
            <TableHead>Data Inicial</TableHead>
            <TableHead>Data Final</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clothingData?.items?.map((item) => (
            <TableRow className="cursor-pointer" key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.store.name}</TableCell>
              <TableCell>$ {formatCurrencyBR(item.bids[0].bid)}</TableCell>
              <TableCell>
                {formatDate(
                  concatDateTimeToDate(
                    String(item.initial_date),
                    item.initial_time
                  )
                )}
              </TableCell>
              <TableCell>
                {formatDate(
                  concatDateTimeToDate(String(item.end_date), item.end_time)
                )}
              </TableCell>
              <TableCell>
                {constantStatus.find((status) => status.value === item.status)
                  ?.label ||
                  item.status ||
                  "Indefinido"}
              </TableCell>

              <TableCell>
                <button
                  className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModalOpen(item);
                  }}
                >
                  Ver Lances
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isUsersBids} onOpenChange={setIsUsersBids}>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="mb-4">Lances dados</DialogTitle>
            <DialogDescription>
              <Timeline defaultValue={3}>
                {item?.bids
                  .sort((a, b) => b.bid - a.bid)
                  .map((item, index) => (
                    <TimelineItem
                      key={item.id}
                      step={item.id}
                      className="group-data-[orientation=vertical]/timeline:ms-10"
                    >
                      <TimelineHeader>
                        <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                        <TimelineDate>
                          {item?.date
                            ? formatDate(
                                concatDateTimeToDate(
                                  String(item?.date),
                                  item?.time
                                )
                              )
                            : "sem data"}
                        </TimelineDate>
                        <TimelineTitle>{item.buyer.name}</TimelineTitle>
                        <TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-8 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                          <div
                            className={cn(
                              " flex items-center justify-center rounded-full text-lg w-full h-full",
                              index === 0
                                ? "bg-green-800 text-white"
                                : "bg-sky-800 text-white"
                            )}
                          >
                            {index + 1}
                          </div>
                        </TimelineIndicator>
                      </TimelineHeader>
                      <TimelineContent>
                        <a
                          href={`https://www.instagram.com/${item.buyer.instagram}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                          {item.buyer.instagram}{" "}
                        </a>{" "}
                        -{" "}
                        <a href={`tel:${item.buyer.contact}`}>
                          {item.buyer.contact}
                        </a>
                      </TimelineContent>
                      <TimelineContent className="mb-4 text-sm font-bold">
                        Valor dado: R$ {formatCurrencyBR(item.bid)}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
              </Timeline>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuctionHistory;
