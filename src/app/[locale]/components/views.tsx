"use client";
import { useEffect, useState } from "react";
import { shortenLargeNumber } from "@applocale/functions/functions";
import { useTranslations } from "next-intl";

export interface ViewsProps {
    counter: number; 
}

export default function Views({counter}: ViewsProps) {
    const t = useTranslations('ui.text');
    const [views, setViews] = useState(counter ?? 0);
    const viewsval = shortenLargeNumber(parseInt("" + views), 1);
    
    useEffect(() => {
        if(!views) {
            setViews(views);
        }
    }, [views]);

    return (
        <div>
            <i className="bi bi-eye"></i>
            <span className="txtviews">
                {t('txtviews', {views: viewsval}) ?? `Views: ${viewsval}`}
            </span>
        </div>
    );
}