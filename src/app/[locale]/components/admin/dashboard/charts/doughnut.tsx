import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getColorGrid, getColorTxt } from '@applocale/functions/chartfunctions';
import { Dataset } from '@applocale/interfaces/dataset';
import FetchData from '@applocale/utils/fetchdata';
import LoadingComp from '@applocale/components/ui/loadingcomp';
import { useLocale, useTranslations } from 'next-intl';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({ theme }: { theme: string }) => {
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
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }
        ],
    };

    const options = {
        type: 'doughnut',
        scales: {
            y: {
                display: false,
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
                    display: false,
                    color: colorgrid,
                    zeroLineColor: colorgrid
                }
            },
            x: {
                display: false,
                title: {
                    display: true,
                    text: t("lblxaxis") ?? "Months",
                    color: colortxt
                },
                ticks: {
                    color: colortxt
                },
                grid: {
                    display: false,
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

    return <Doughnut options={options} data={vdata} />;
}
