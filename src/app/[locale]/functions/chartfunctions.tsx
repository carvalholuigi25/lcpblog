import { ChartTypes } from "@applocale/interfaces/charttypes";

export const getChartTypes = (): ChartTypes[] => {
    return [
        {
            id: 1,
            name: 'Vertical Bar',
            value: 'verticalbar'
        },
        {
            id: 2,
            name: 'Horizontal Bar',
            value: 'horizontalbar'
        },
        {
            id: 3,
            name: 'Line',
            value: 'line'
        },
        {
            id: 4,
            name: 'Pie',
            value: 'pie'
        },
        {
            id: 5,
            name: 'Radar',
            value: 'radar'
        },
        {
            id: 6,
            name: 'Doughnut',
            value: 'doughnut'
        },
        {
            id: 7,
            name: 'Polar',
            value: 'polar'
        },
        {
            id: 8,
            name: 'Scatter',
            value: 'scatter'
        },
        {
            id: 9,
            name: 'Bubble',
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