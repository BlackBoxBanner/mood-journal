import { ChartData, ChartDataset } from "chart.js";

export type BarChartDataset<T = unknown> = ChartDataset<"bar", T>[];
export type BarChartProps<TData = unknown, TLabel = string> = ChartData<
	"bar",
	TData,
	TLabel
>;

export type LineChartDataset<T = unknown> = ChartDataset<"line", T>[];
export type LineChartProps<TData = unknown, TLabel = string> = ChartData<
	"line",
	TData,
	TLabel
>;
