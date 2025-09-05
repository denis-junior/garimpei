import CardGraphic from "@/components/CardGraphic";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useGetBidsProduct } from "../services";
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

const ChartEvolutionProduct: React.FC = () => {
  const [idStore, setIdStore] = React.useState<string>("");
  const [idProduct, setIdProduct] = React.useState<string>("");
  const { data } = useGetBidsProduct(Number(idProduct));
  const { data: listStores } = useGetAllStores({ page: 1, size: 100 });
  useEffect(() => {
    if (listStores?.length) {
      setIdStore(String(listStores[0]?.id));
    }
  }, [listStores]);

  useEffect(() => {
    if (idStore && listStores?.length) {
      setIdProduct(String(listStores[0].clothings[0]?.id));
    }
  }, [idStore, listStores]);

  return (
    <CardGraphic
      title="Evolução dos Lances por Produto"
      subtitle="Compare o desempenho de lances entre produtos específicos."
      action={
        <div className="flex gap-4">
          <Select value={idProduct} onValueChange={setIdProduct}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione Um Produto" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Produto</SelectLabel>
                {listStores
                  ?.find((store) => store.id === Number(idStore))
                  ?.clothings?.map((clothing) => (
                    <SelectItem key={clothing.id} value={String(clothing.id)}>
                      {clothing.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
        </div>
      }
    >
      <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
        <LineChart
          accessibilityLayer
          data={data?.map((e) => ({ ...e, date: e.date + "-" + e.time })) ?? []}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="bid"
            name="Lances"
            type="monotone"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </CardGraphic>
  );
};

export default ChartEvolutionProduct;
