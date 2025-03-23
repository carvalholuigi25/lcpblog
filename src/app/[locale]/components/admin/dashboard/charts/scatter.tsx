import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const colortxt = "gray";

const options = {
    type: 'scatter',
    scales: {
        y: {
            title: {
                display: true,
                color: colortxt
            },
            display: true,
            min: 0,
            max: 100,
            beginAtZero: true,
            ticks: {
                color: colortxt
            }
        },
        x: {
            title: {
                display: true,
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

const data = {
    datasets: [
        {
            label: 'Posts',
            data: Array.from({ length: 100 }, () => ({
                x: faker.number.int({ min: -100, max: 100 }),
                y: faker.number.int({ min: -100, max: 100 }),
            })),
            backgroundColor: 'rgba(255, 99, 132, 1)',
        },
    ],
};

export const ScatterChart = () => {
    return <Scatter options={options} data={data} />;
}
