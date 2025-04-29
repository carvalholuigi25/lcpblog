import { useTranslations } from "next-intl";
import { ChartTypes } from "@applocale/interfaces/charttypes";

export const GetChartTypes = (): ChartTypes[] => {
    const t = useTranslations('pages.AdminPages.Dashboard.charttypes.options');
    
    return [
        {
            id: 1,
            name: t("verticalBar") ?? 'Vertical Bar',
            value: 'verticalbar'
        },
        {
            id: 2,
            name: t("horizontalBar") ?? 'Horizontal Bar',
            value: 'horizontalbar'
        },
        {
            id: 3,
            name: t("line") ?? 'Line',
            value: 'line'
        },
        {
            id: 4,
            name: t("pie") ?? 'Pie',
            value: 'pie'
        },
        {
            id: 5,
            name: t("radar") ?? 'Radar',
            value: 'radar'
        },
        {
            id: 6,
            name: t("doughnut") ?? 'Doughnut',
            value: 'doughnut'
        },
        {
            id: 7,
            name: t("polarArea") ?? 'Polar',
            value: 'polar'
        },
        {
            id: 8,
            name: t("scatter") ?? 'Scatter',
            value: 'scatter'
        },
        {
            id: 9,
            name: t("bubble") ?? 'Bubble',
            value: 'bubble'
        }
    ];
}

export const getColorTxt = (theme: string) => {
    return theme == "light" ? "#000000" : 
    theme == "dark" ? "#ffffff" : 
    theme == "system" ? "#000000" : 
    theme == "red" ? "#ffffff" : 
    theme == "green" ? "#000000" : 
    theme == "blue" ? "#ffffff" : 
    theme == "yellow" ? "#000000" : 
    theme == "vanilla" ? "#000000" : 
    "#000000";
}

export const getColorGrid = (theme: string) => {
    return theme == "light" ? "rgba(0, 0, 0, 0.5)" : 
    theme == "dark" ? "rgba(255, 255, 255, 0.5)" : 
    theme == "system" ? "rgba(0, 0, 0, 0.5)" : 
    theme == "red" ? "rgba(255, 255, 255, 0.5)" : 
    theme == "green" ? "rgba(0, 0, 0, 0.5)" : 
    theme == "blue" ? "rgba(255, 255, 255, 0.5)" : 
    theme == "yellow" ? "rgba(0, 0, 0, 0.5)" : 
    theme == "vanilla" ? "rgba(0, 0, 0, 0.5)" : 
    "rgba(0, 0, 0, 0.5)";
}