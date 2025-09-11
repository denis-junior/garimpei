import CardGraphic from "@/components/CardGraphic";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useGetAllProductStores } from "../services";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllStores } from "@/modules/Store/services/CRUD-stores";
import { chartConfig } from "@/core/setupChart";

const ChartEvolutionAllProductPerStore: React.FC = () => {
  const [idStore, setIdStore] = React.useState<string>("");
  const { data } = useGetAllProductStores(Number(idStore));
  const { data: listStores } = useGetAllStores({ page: 1, size: 100 });

  useEffect(() => {
    if (listStores?.length) {
      setIdStore(String(listStores[0].id));
    }
  }, [listStores]);

  return (
    <CardGraphic
      title="Evolução dos Lances por Produto"
      subtitle="Evolução dos lances em todos os produtos da sua loja ao longo do tempo."
      action={
        <Select value={idStore} onValueChange={setIdStore}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione uma loja" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Lojas</SelectLabel>
              {listStores?.map((store) => (
                <SelectItem key={store.id} value={String(store.id)}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      }
    >
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: `${(data?.length || 1) * 120}px` }}>
          <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
            <BarChart
              accessibilityLayer
              data={data || []}
              width={(data?.length || 1) * 120}
              barSize={60}
              barCategoryGap={40}
              height={400}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="clothingName"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="initialBid"
                fill="var(--color-desktop)"
                name={"Valor Inicial : R$"}
                radius={4}
              />
              <Bar
                dataKey="lastBid"
                name={"Valor Final : R$ "}
                fill="var(--color-mobile)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </CardGraphic>
  );
};

export default ChartEvolutionAllProductPerStore;
