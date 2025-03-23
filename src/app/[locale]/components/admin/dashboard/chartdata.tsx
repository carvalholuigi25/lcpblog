
import React, { useState } from "react";
import {
    VerticalBarChart, HorizontalBarChart, LineChart, 
    PieChart, RadarChart, DoughnutChart, 
    PolarChart, ScatterChart, BubbleChart
} from "@applocale/components/admin/dashboard/charts/index";

export default function ChartData() {
    const [chartType] = useState("verticalbar");

    return (
        <div className="mychart bshadow">
            {!chartType &&
                <VerticalBarChart />
            }

            {!!chartType && (
                <>
                    {chartType == 'horizontalbar' &&
                        <HorizontalBarChart />
                    }

                    {chartType == 'verticalbar' &&
                        <VerticalBarChart />
                    }

                    {chartType == 'line' &&
                        <LineChart />
                    }

                    {chartType == 'pie' &&
                        <PieChart />
                    }

                    {chartType == 'radar' &&
                        <RadarChart />
                    }

                    {chartType == 'doughnut' &&
                        <DoughnutChart />
                    }

                    {chartType == 'polar' &&
                        <PolarChart />
                    }

                    {chartType == 'scatter' &&
                        <ScatterChart />
                    }

                    {chartType == 'bubble' &&
                        <BubbleChart />
                    }
                </>
            )}
        </div>
    );
}