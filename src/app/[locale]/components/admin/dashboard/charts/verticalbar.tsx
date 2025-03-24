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
import { getColorTxt } from '@/app/[locale]/functions/chartfunctions';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const VerticalBarChart = ({theme}: {theme: string}) => {
    const labels = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

    const options = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Posts",
                    color: getColorTxt(theme)
                },
                display: true,
                min: 0,
                max: 1000,
                ticks: {
                    color: getColorTxt(theme)
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Months",
                    color: getColorTxt(theme)
                },
                display: true,
                ticks: {
                    color: getColorTxt(theme)
                }
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        color: getColorTxt(theme),
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
                color: getColorTxt(theme),
            },
        },
    };

    return <Bar options={options} data={data} />;
}
