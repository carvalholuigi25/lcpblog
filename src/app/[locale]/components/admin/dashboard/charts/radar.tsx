import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const colortxt = "gray";
const labels = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
const datasets = [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100];

const data = {
    labels: labels,
    datasets: [
        {
            label: '# of Posts',
            data: datasets,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
    ],
};

const options = {
    type: 'radar',
    scales: {
        y: {
            title: {
                display: true,
                text: "Posts",
                color: colortxt
            },
            display: false,
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
            display: false,
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

export const RadarChart = () => {
    return <Radar data={data} options={options} />;
}
