import CardGraphic from "@/components/CardGraphic";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
} from "recharts";

const DashboardSeller: React.FC = () => {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartData2 = [
    { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Dashboard das suas vendas
        </h1>
        <p className="text-gray-600">
          Navegue pela nossa seleção criteriosa seleção de roupas vintage e de
          grife disponíveis para leilão.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CardGraphic
          title="Distribuição dos Lances por Faixa de Valor"
          subtitle="Navegue pela nossa seleção criteriosa seleção de roupas vintage e de grife disponíveis para leilão."
        >
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardGraphic>

        <CardGraphic
          title="Receita Total por Mês"
          subtitle="Navegue pela nossa seleção criteriosa seleção de roupas vintage e de grife disponíveis para leilão."
        >
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[400px]" // aumentou a altura
          >
            <RadialBarChart
              data={chartData2}
              endAngle={100}
              innerRadius={80}
              outerRadius={140}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="visitors" background />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {chartData2[0].visitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </CardGraphic>
        <div className="col-span-1 md:col-span-2">
          <CardGraphic
            title="Evolução dos Lances por Produto"
            subtitle="Navegue pela nossa seleção criteriosa seleção de roupas vintage e de grife disponíveis para leilão."
          >
            <ChartContainer
              config={chartConfig}
              className="max-h-[500px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend
                  content={(props) => <ChartLegendContent {...props} />}
                />
                <Bar
                  dataKey="desktop"
                  stackId="a"
                  fill="var(--color-desktop)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="mobile"
                  stackId="a"
                  fill="var(--color-mobile)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardGraphic>
        </div>
      </div>
    </div>
  );
};

export default DashboardSeller;
