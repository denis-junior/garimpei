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
import PrimaryButton from "@/components/PrimaryButton";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Loja</TableHead>
            <TableHead>Lance Final</TableHead>
            <TableHead>Data Inicial</TableHead>
            <TableHead>Data Final</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clothingData?.items?.map((item) => (
            <TableRow className="cursor-pointer" key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.store.name}</TableCell>
              <TableCell>$ {formatCurrencyBR(item.bids?.[0]?.bid)}</TableCell>
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
                <AlertDialog>
                  <AlertDialogTrigger>
                    <PrimaryButton>Pago e entregue</PrimaryButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Deseja realmente marcar como entregue?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso irá excluir
                        permanentemente sua conta e remover seus dados de nossos
                        servidores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => markPaid(item.id)}>
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <PrimaryButton>Ganhador Ausente</PrimaryButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Deseja realmente marcar como ganhador ausente?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        O ganhador atual será considerado ausente e perderá o
                        direito ao item. O sistema selecionará automaticamente o
                        próximo da lista de lances.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => forceNextBidder(item.id)}
                      >
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
              <TableCell>
                <button
                  className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWinnerModalOpen(item);
                  }}
                >
                  Atual vencedor
                </button>
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

      <Dialog open={isWinnerBids} onOpenChange={setIsWinnerBids}>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="mb-4">Atual ganhador</DialogTitle>
            <DialogDescription>
              {winner && (
                <>
                  <div className="w-full flex flex-col items-center mb-4 gap-1">
                    <div>
                      {winner?.date
                        ? formatDate(
                            concatDateTimeToDate(
                              String(winner?.date),
                              winner?.time
                            )
                          )
                        : "sem data"}
                    </div>
                    <div>{winner.buyer.name}</div>
                    <div className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-8 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                      <div
                        className={cn(
                          " flex items-center justify-center rounded-full text-lg w-full h-full",
                          "bg-green-800 text-white"
                        )}
                      >
                        {1}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center mb-4 gap-1">
                    <a
                      href={`https://www.instagram.com/${winner.buyer.instagram}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      {winner.buyer.instagram}{" "}
                    </a>{" "}
                    -{" "}
                    <a href={`tel:${winner.buyer.contact}`}>
                      {winner.buyer.contact}
                    </a>
                  </div>
                  <div className="mb-4 text-center text-sm font-bold">
                    Valor dado: R$ {formatCurrencyBR(winner.bid)}
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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

export default CompletedAuctions;
