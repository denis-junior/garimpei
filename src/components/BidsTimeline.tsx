import React from "react";
import { concatDateTimeToDate, formatDate } from "@/utils/formatDate";
import { formatCurrencyBR } from "@/utils/formatCurrencyBr";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IBid } from "@/modules/Bids/Types";
import {
  User,
  Calendar,
  DollarSign,
  Instagram,
  Phone,
  Trophy,
  Medal,
} from "lucide-react";

interface BidsTimelineProps {
  bids: IBid[];
  showWinnerHighlight?: boolean;
}

const BidsTimeline: React.FC<BidsTimelineProps> = ({
  bids,
  showWinnerHighlight = true,
}) => {
  const sortedBids = bids.sort((a, b) => b.bid - a.bid);

  return (
    <div className="space-y-4 max-h-96 pt-4 overflow-y-auto">
      {sortedBids.map((bid, index) => (
        <div
          key={bid.id}
          className={cn(
            "relative bg-white rounded-lg border shadow-sm p-4 transition-all duration-200",
            index === 0 && showWinnerHighlight
              ? "border-green-500 bg-green-50 shadow-green-100"
              : "border-border hover:shadow-md"
          )}
        >
          {/* Badge de posição */}
          <div className="absolute -top-2 -left-2">
            <Badge
              variant={
                index === 0 && showWinnerHighlight ? "default" : "outline"
              }
              className={cn(
                "flex items-center gap-1 text-xs font-semibold",
                index === 0 && showWinnerHighlight
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white"
              )}
            >
              {index === 0 && showWinnerHighlight ? (
                <Trophy className="h-3 w-3" />
              ) : index === 1 ? (
                <Medal className="h-3 w-3" />
              ) : (
                <span className="w-3 h-3 rounded-full bg-current flex-shrink-0" />
              )}
              #{index + 1}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Informações do comprador */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {bid.buyer.name}
                </span>
                {index === 0 && showWinnerHighlight && (
                  <Badge variant="secondary" className="text-xs">
                    Vencedor
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Instagram className="h-4 w-4 text-pink-500" />
                <a
                  href={`https://instagram.com/${bid.buyer.instagram.replace(
                    /@/,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
                >
                  {bid.buyer.instagram}
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-blue-500" />
                <a
                  href={`tel:${bid.buyer.contact}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  {bid.buyer.contact}
                </a>
              </div>
            </div>

            {/* Informações do lance */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Valor do Lance
                  </span>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      index === 0 && showWinnerHighlight
                        ? "text-green-600"
                        : "text-primary"
                    )}
                  >
                    R$ {formatCurrencyBR(bid.bid)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Data do Lance</span>
                  <span className="text-foreground font-medium">
                    {bid?.date
                      ? formatDate(
                          concatDateTimeToDate(String(bid?.date), bid?.time)
                        )
                      : "Data não informada"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Linha decorativa para o vencedor */}
          {index === 0 && showWinnerHighlight && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-b-lg" />
          )}
        </div>
      ))}

      {bids.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Nenhum lance foi dado ainda
          </p>
        </div>
      )}
    </div>
  );
};

export default BidsTimeline;
