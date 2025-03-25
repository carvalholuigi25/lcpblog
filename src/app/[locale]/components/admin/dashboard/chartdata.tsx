
import React, { Suspense } from "react";
import {
    VerticalBarChart, HorizontalBarChart, LineChart,
    PieChart, RadarChart, DoughnutChart,
    PolarChart, ScatterChart, BubbleChart
} from "@applocale/components/admin/dashboard/charts/index";

export default function ChartData({ theme, type = "verticalbar" }: { theme: string, type?: string }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="mychart bshadow">
                {!type &&
                    <VerticalBarChart theme={theme} />
                }

                {!!type && (
                    <>
                        {(type == 'horizontalbar' || type == 'hbar') &&
                            <HorizontalBarChart theme={theme} />
                        }

                        {(type == 'verticalbar' || type == 'vbar') &&
                            <VerticalBarChart theme={theme} />
                        }

                        {type == 'line' &&
                            <LineChart theme={theme} />
                        }

                        {type == 'pie' &&
                            <PieChart theme={theme} />
                        }

                        {type == 'radar' &&
                            <RadarChart theme={theme} />
                        }

                        {type == 'doughnut' &&
                            <DoughnutChart theme={theme} />
                        }

                        {type == 'polar' &&
                            <PolarChart theme={theme} />
                        }

                        {type == 'scatter' &&
                            <ScatterChart theme={theme} />
                        }

                        {type == 'bubble' &&
                            <BubbleChart theme={theme} />
                        }
                    </>
                )}
            </div>
        </Suspense>
    );
}