import React, { useEffect } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { getColorTxt } from '@/app/[locale]/functions/chartfunctions';
import { Dataset } from '@/app/[locale]/interfaces/dataset';
import FetchData from '@/app/[locale]/utils/fetchdata';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const BubbleChart = ({ theme }: { theme: string }) => {
    const colortxt = getColorTxt(theme);
    const [loading, setLoading] = React.useState(true);
    const [chdata, setChdata] = React.useState<Dataset>({
        datasetId: 0,
        year: new Date().getFullYear(),
        label: [],
        data: []
    });

    useEffect(() => {
        async function fetchChartData() {
            const data = await FetchData({
                url: `api/posts/dataset`,
                method: 'get',
                reqAuthorize: false
            });

            setChdata(JSON.parse(JSON.stringify(data)));
        }

        fetchChartData();
        setLoading(false);
    }, [loading]);

    if (!chdata) {
        return (
            <div>Loading...</div>
        );
    }

    const { label, data } = chdata;

    const vdata = {
        labels: label,
        datasets: [
            {
                label: 'Posts',
                data: data.map(x => {
                    return { x: x * 10, y: x };
                }),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

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

    return <Bubble options={options} data={vdata} />;
}
