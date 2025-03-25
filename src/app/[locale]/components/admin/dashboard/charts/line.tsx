
import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { getColorTxt } from "@/app/[locale]/functions/chartfunctions";
import { Dataset } from "@/app/[locale]/interfaces/dataset";
import FetchData from "@/app/[locale]/utils/fetchdata";

ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

export const LineChart = ({ theme }: { theme: string }) => {
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
                fill: true,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            }
        ],
    };

    const options = {
        type: 'line',
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Posts",
                    color: colortxt
                },
                display: true,
                min: 0,
                max: 100,
                ticks: {
                    color: colortxt
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Months",
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

    return <Line options={options} data={vdata} />;
}