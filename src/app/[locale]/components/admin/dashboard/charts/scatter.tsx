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
import { getColorTxt } from '@/app/[locale]/functions/chartfunctions';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const ScatterChart = ({theme}: {theme: string}) => {
    const colortxt = getColorTxt(theme);

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

    return <Scatter options={options} data={data} />;
}
