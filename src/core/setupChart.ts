import { ChartConfig } from "@/components/ui/chart";

export const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export const COLORSCHART = [
  "#14b8a6", // teal-600
  "#f59e42", // orange-400
  "#6366f1", // indigo-500
  "#f43f5e", // rose-500
  "#22d3ee", // cyan-400
  "#facc15", // yellow-400
];
