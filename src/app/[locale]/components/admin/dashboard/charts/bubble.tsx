import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { getColorTxt } from '@/app/[locale]/functions/chartfunctions';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const BubbleChart = ({ theme }: { theme: string }) => {
    const colortxt = getColorTxt(theme);

    const options = {
        type: 'bubble',
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
                label: 'Red dataset',
                data: Array.from({ length: 50 }, () => ({
                    x: faker.number.int({ min: -100, max: 100 }),
                    y: faker.number.int({ min: -100, max: 100 }),
                    r: faker.number.int({ min: 5, max: 20 }),
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Blue dataset',
                data: Array.from({ length: 50 }, () => ({
                    x: faker.number.int({ min: -100, max: 100 }),
                    y: faker.number.int({ min: -100, max: 100 }),
                    r: faker.number.int({ min: 5, max: 20 }),
                })),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return <Bubble options={options} data={data} />;
}
