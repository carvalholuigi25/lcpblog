import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { getColorGrid, getColorTxt } from '@applocale/functions/chartfunctions';
import { Dataset } from '@applocale/interfaces/dataset';
import FetchData from '@applocale/utils/fetchdata';
import LoadingComp from '@/app/[locale]/components/ui/loadingcomp';
import { useLocale, useTranslations } from 'next-intl';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export const PolarChart = ({ theme }: { theme: string }) => {
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
                    'rgba(255, 99, 132, 1)',
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
        type: 'polarArea',
        scales: {
            y: {
                display: false,
                min: 0,
                max: 100,
                title: {
                    display: true,
                    text: t('lblyaxis') ?? "Nº of posts",
                    color: colortxt
                },
                ticks: {
                    color: colortxt,
                    textStrokeColor: colortxt
                },
                grid: {
                    display: true,
                    color: colorgrid,
                    zeroLineColor: colorgrid
                },
                border: {
                    color: colortxt
                },
                angleLines: {
                    color: colorgrid
                }
            },
            x: {
                display: false,
                title: {
                    display: true,
                    text: t('lblxaxis') ?? "Months",
                    color: colortxt
                },
                ticks: {
                    color: colortxt,
                    textStrokeColor: colortxt
                },
                grid: {
                    display: true,
                    color: colorgrid,
                    zeroLineColor: colorgrid
                },
                border: {
                    color: colortxt
                },
                angleLines: {
                    color: colorgrid
                }
            },
            r: {
                display: true,
                ticks: {
                    display: true,
                    color: colortxt,
                    textStrokeColor: colortxt
                },
                grid: {
                    display: true,
                    color: colortxt,
                    zeroLineColor: colortxt
                },
                border: {
                    color: colortxt
                },
                angleLines: {
                    color: colortxt
                },
                pointLabels: {
                    color: colortxt
                }
            }
        },
        scale: {
            angleLines: {
                color: colorgrid
            },
            pointLabels: {
                color: colorgrid
            }
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

    return <PolarArea options={options} data={vdata} />;
}
