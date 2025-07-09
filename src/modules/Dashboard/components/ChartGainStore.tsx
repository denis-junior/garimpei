import CardGraphic from "@/components/CardGraphic";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chartConfig, COLORSCHART } from "@/core/setupChart";
import { useGetAllStores } from "@/modules/Store/services/CRUD-stores";
import React, { useEffect } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { useGetGainStore, useGetNoBidsStats } from "../services";
import { formatCurrencyBR } from "@/utils/formatCurrencyBr";

const ChartGainStore: React.FC = () => {
  const [idStore, setIdStore] = React.useState<string>("");
  const { data: listStores } = useGetAllStores({ page: 1, size: 100 });
  const { data } = useGetGainStore(Number(idStore));
  const { data: notBids } = useGetNoBidsStats(Number(idStore));
  useEffect(() => {
    if (listStores?.length) {
      setIdStore(String(listStores[0].id));
    }
  }, [listStores]);

  return (
    <>
      <CardGraphic
        title="Receita Total por Mês"
        subtitle="Veja a distribuição da receita total por loja"
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
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[500px]  min-h-[300px] md:min-h-[400px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data?.filter((e) => !e.total) ?? []}
              dataKey="value"
              nameKey="name"
              innerRadius={90}
              strokeWidth={5}
            >
              {data?.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORSCHART[index % COLORSCHART.length]}
                />
              ))}
            </Pie>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-sm font-semibold"
            >
              <tspan x="50%" dy="-0.1em" fontSize="24">
                {formatCurrencyBR(Number(data?.find((e) => e.total)?.value))}
              </tspan>
              <tspan fontSize={18} x="50%" dy="1.5em">
                Total
              </tspan>
            </text>
          </PieChart>
        </ChartContainer>
      </CardGraphic>
      <CardGraphic
        title="Receita Total por Mês"
        subtitle="Veja a distribuição da receita total por loja"
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
        className="h-full"
      >
        <div className="h-full flex flex-col md:flex-row ">
          <div className="self-center flex-1 md:self-end">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[400px] "
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={[
                    {
                      name: "Porcentagem de produtos sem lances",
                      value: notBids?.percentageNoBids,
                    },
                    {
                      name: "Porcentagem de produtos cem lances",
                      value: 100 - (notBids?.percentageNoBids ?? 0),
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {data?.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORSCHART[index % COLORSCHART.length]}
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-sm font-semibold"
                >
                  <tspan x="50%" y="50%" fontSize="18">
                    {notBids?.percentageNoBids.toFixed(2)}%
                  </tspan>
                </text>
              </PieChart>
            </ChartContainer>
            <h3 className="text-center">Porcentagem de produtos sem lances</h3>
          </div>
          <div className="self-center flex-1  md:self-start">
            <h3 className="text-center">
              somatória dos valores de produtos sem lances
            </h3>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[400px] "
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={[
                    {
                      name: "somatória dos valores de produtos sem lances",
                      value: Number(notBids?.sumInitialNoBids),
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {data?.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORSCHART[index % COLORSCHART.length]}
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-sm font-semibold"
                >
                  <tspan x="50%" y="50%" fontSize="18">
                    {formatCurrencyBR(Number(notBids?.sumInitialNoBids))}
                  </tspan>
                </text>
              </PieChart>
            </ChartContainer>
          </div>
          <div className="self-center flex-1  md:self-end">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[400px] "
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={[
                    {
                      name: "Quantidade de itens sem lances e finalizados",
                      value: notBids?.finishedNoBids,
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  strokeWidth={5}
                >
                  {data?.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORSCHART[index % COLORSCHART.length]}
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-sm font-semibold"
                >
                  <tspan x="50%" y="50%" fontSize="18">
                    {notBids?.finishedNoBids}
                  </tspan>
                </text>
              </PieChart>
            </ChartContainer>
            <h3 className="text-center">
              Quantidade de itens sem lances e finalizados
            </h3>
          </div>
        </div>
      </CardGraphic>
    </>
  );
};

export default ChartGainStore;
