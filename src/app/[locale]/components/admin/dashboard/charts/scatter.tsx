import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { getColorGrid, getColorTxt } from '@/app/[locale]/functions/chartfunctions';
import { Dataset } from '@/app/[locale]/interfaces/dataset';
import FetchData from '@/app/[locale]/utils/fetchdata';
import LoadingComp from '@/app/[locale]/components/loadingcomp';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const ScatterChart = ({ theme }: { theme: string }) => {
    const colortxt = getColorTxt(theme);
    const colorgrid = getColorGrid(theme);
    
    const [loading, setLoading] = useState(true);
    const [chdata, setChdata] = useState<Dataset>({
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

    if (!chdata || !!loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const { label, data } = chdata;

    const vdata = {
        labels: label,
        datasets: [
            {
                label: 'Posts',
                data: data.map(x => {
                    return { 
                        x: x * 1, 
                        y: x * 1 
                    };
                }),
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ],
    };

    const options = {
        type: 'scatter',
        scales: {
            y: {
                display: true,
                beginAtZero: true,
                min: 0,
                max: 100,
                title: {
                    display: true,
                    color: colortxt
                },
                ticks: {
                    color: colortxt
                },
                grid: {
                    display: true,
                    color: colorgrid,
                    zeroLineColor: colorgrid
                }
            },
            x: {
                display: true,
                title: {
                    display: true,
                    color: colortxt
                },
                ticks: {
                    color: colortxt
                },
                grid: {
                    display: true,
                    color: colorgrid,
                    zeroLineColor: colorgrid
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

    return <Scatter options={options} data={vdata} />;
}
