import React, { useEffect, useState } from 'react';
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
import { getColorGrid, getColorTxt } from '@applocale/functions/chartfunctions';
import { Dataset } from '@applocale/interfaces/dataset';
import FetchData from '@applocale/utils/fetchdata';
import LoadingComp from '@applocale/components/ui/loadingcomp';
import { useLocale, useTranslations } from 'next-intl';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const HorizontalBarChart = ({ theme }: { theme: string }) => {
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
                reqAuthorize:  process.env.NODE_ENV === "production" ? true : false
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
                display: true,
                min: 0,
                max: 100,
                title: {
                    display: false,
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
                    display: false,
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
