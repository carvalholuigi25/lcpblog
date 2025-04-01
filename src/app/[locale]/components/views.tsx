"use client";
import { useEffect, useState } from "react";
import { shortenLargeNumber } from "@applocale/functions/functions";

export interface ViewsProps {
    counter: number; 
}

export default function Views({counter}: ViewsProps) {
    const [views, setViews] = useState(counter ?? 0);
    
    useEffect(() => {
        if(!views) {
            setViews(views);
        }
    }, [views]);

    return (
        <div>
            <i className="bi bi-eye"></i>
            <span className="txtviews">
                Views: {shortenLargeNumber(parseInt("" + views), 1)}
            </span>
        </div>
    );
}