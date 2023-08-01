import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'
ChartJS.register(...registerables)

function LineChart({ chartData, options }: any) {
    return <Line data={chartData} options={options} />;
}

export default LineChart;