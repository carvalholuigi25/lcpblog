
import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

export default function ChartData() {
    const colortxt = "gray";
    const labels = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const datasets = [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100];

    const data = {
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

    // To make configuration
    const options = {
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

    return (
        <div className="mychart">
            <Line data={data} options={options} />
        </div>
    );
}