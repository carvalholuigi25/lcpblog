
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { getColorTxt } from "@/app/[locale]/functions/chartfunctions";

ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

export const LineChart = ({ theme }: { theme: string }) => {
    const colortxt = getColorTxt(theme);
    const labels = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const datasets = [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100];

    const dataline = {
        labels: labels,
        datasets: [
            {
                label: "Posts",
                data: datasets,
                fill: true,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            }
        ],
    };

    const options = {
        type: 'line',
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Posts",
                    color: colortxt
                },
                display: true,
                min: 0,
                max: 100,
                ticks: {
                    color: colortxt
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Months",
                    color: colortxt
                },
                display: true,
                ticks: {
                    color: colortxt
                }
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        color: colortxt,
        backgroundColor: 'rgba(0, 0, 0, .3)',
        plugins: {
            colors: {
                enable: true,
                forceOverride: true
            }
        },
    };

    return <Line data={dataline} options={options} />;
}