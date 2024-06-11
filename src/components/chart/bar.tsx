"use client";

import dynamic from 'next/dynamic';
import 'chart.js/auto';
import React from "react";
import {BarChartType} from "@/components/chart/index";

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

const BarChart: BarChartType = (props) => {
  return <Bar data={props}/>
};
export default BarChart;