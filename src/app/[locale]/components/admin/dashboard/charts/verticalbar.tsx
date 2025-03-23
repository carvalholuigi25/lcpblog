import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const colortxt = "gray";
const labels = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
            max: 1000,
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
        },
        legend: {
            position: 'top' as const,
        },
        title: {
            display: false,
            text: '',
        },
    },
};


const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

export const VerticalBarChart = () => {
    return <Bar options={options} data={data} />;
}
