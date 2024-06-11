import {ChartData, ChartDataset} from "chart.js";
import React from "react";

export type BarChartDataset<T = unknown> = ChartDataset<"bar", T>[]
export type BarChartProps<TData = unknown, TLabel = string> = ChartData<"bar", TData, TLabel>
export type BarChartType = <TData = unknown, TLabel = string>(props: BarChartProps<TData, TLabel>) => React.JSX.Element

export type LineChartDataset<T = unknown> = ChartDataset<"line", T>[]
export type LineChartProps<TData = unknown, TLabel = string> = ChartData<"line", TData, TLabel>
export type LineChartType = <TData = unknown, TLabel = string>(props: LineChartProps<TData, TLabel>) => React.JSX.Element
