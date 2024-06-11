"use client";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import {LineChartType} from "@/components/chart/index";

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

const LineChart: LineChartType = (props) => {
  return <Line data={props}/>
};
export default LineChart;