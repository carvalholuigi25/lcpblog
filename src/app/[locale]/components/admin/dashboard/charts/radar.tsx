import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, elements} from 'chart.js';
import { getColorGrid, getColorTxt } from '@/app/[locale]/functions/chartfunctions';
import { Dataset } from '@/app/[locale]/interfaces/dataset';
import FetchData from '@/app/[locale]/utils/fetchdata';
import LoadingComp from '@/app/[locale]/components/loadingcomp';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, elements);

export const RadarChart = ({ theme }: { theme: string }) => {
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
                data: data,
                backgroundColor: colorgrid,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ],
    };

    const options = {
        type: 'radar',
        scales: {
            y: {
                display: false,
                min: 0,
                max: 100,
                title: {
                    display: true,
                    text: "Posts",
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
                    text: "Months",
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
        textStrokeColor: colortxt,
        backdropColor: 'rgba(0, 0, 0, .3)',
        backgroundColor: 'rgba(0, 0, 0, .3)',
        plugins: {
            colors: {
                enable: true,
                forceOverride: true
            }
        }
    };

    return <Radar options={options} data={vdata} />;
}
