import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { useLocale, useTranslations } from 'next-intl';
import { getColorGrid, getColorTxt } from '@applocale/functions/chartfunctions';
import { Dataset } from '@applocale/interfaces/dataset';
import FetchData from '@applocale/utils/fetchdata';
import LoadingComp from '@applocale/components/loadingcomp';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const BubbleChart = ({ theme }: { theme: string }) => {
    const t = useTranslations('pages.AdminPages.Dashboard.chart');
    
    const colortxt = getColorTxt(theme);
    const colorgrid = getColorGrid(theme);
    const locale = useLocale();
    
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
                url: `api/posts/dataset?lang=${locale}`,
                method: 'get',
                reqAuthorize: false
            });

            setChdata(JSON.parse(JSON.stringify(data)));
        }

        fetchChartData();
        setLoading(false);
    }, [loading, locale]);

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
                label: t("titlechart") ?? 'Posts',
                data: data.map(x => {
                    return { 
                        x: x * 1, 
                        y: x * 1, 
                        r: x * 5
                    };
                }),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    const options = {
        type: 'bubble',
        scales: {
            y: {
                display: true,
                beginAtZero: true,
                min: 0,
                max: 100,
                title: {
                    display: true,
                    text: t("lblyaxis") ?? "Nº of posts",
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
                    text: t("lblxaxis") ?? "Months",
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

    return <Bubble options={options} data={vdata} />;
}
