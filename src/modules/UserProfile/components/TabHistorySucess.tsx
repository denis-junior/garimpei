import React from "react";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { useSindAuctionsWonByBuyer } from "../service/History";
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

const TabHistorySucess: React.FC = () => {
  const [isUsersBids, setIsUsersBids] = React.useState(false);
  const [item, setItem] = React.useState<IProduct>();
  const { data } = useSindAuctionsWonByBuyer();

  const handleModalOpen = (item: IProduct) => {
    setIsUsersBids(true);
    setItem(item);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Loja</TableHead>
            <TableHead>Instagram</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Valor Final</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow
              className="cursor-pointer"
              key={item.id}
              onClick={() => handleModalOpen(item)}
            >
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.store.name}</TableCell>

              <TableCell>
                <a
                  href={`https://www.instagram.com/${item.store.instagram}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.store.instagram}
                </a>{" "}
                - <a href={`tel:${item.store.contact}`}>{item.store.contact}</a>
              </TableCell>
              <TableCell>{item.store.address}</TableCell>
              <TableCell>$ {formatCurrencyBR(item.bids[0].bid)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isUsersBids} onOpenChange={setIsUsersBids}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Lances dados</DialogTitle>
            <DialogDescription>
              <Timeline defaultValue={3}>
                {item?.bids.map((item, index) => (
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
                        @{item.buyer.instagram}{" "}
                      </a>{" "}
                      -{" "}
                      <a href={`tel:${item.buyer.contact}`}>
                        {item.buyer.contact}
                      </a>
                    </TimelineContent>
                    <TimelineContent className="mt-2 text-sm font-bold">
                      Valor dado: R$ {formatCurrencyBR(item.bid)}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TabHistorySucess;
