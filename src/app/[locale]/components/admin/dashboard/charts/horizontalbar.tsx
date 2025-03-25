import React, { useEffect } from 'react';
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
import { getColorTxt } from '@/app/[locale]/functions/chartfunctions';
import { Dataset } from '@/app/[locale]/interfaces/dataset';
import FetchData from '@/app/[locale]/utils/fetchdata';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const HorizontalBarChart = ({ theme }: { theme: string }) => {
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
                data: data,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        scales: {
            y: {
                title: {
                    display: false,
                    text: "",
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
                    display: false,
                    text: "",
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
                position: 'right' as const,
            },
            title: {
                display: false,
                text: '',
            },
        }
    };

    return <Bar options={options} data={vdata} />;
}
