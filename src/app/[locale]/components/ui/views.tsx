// "use client";
import { shortenLargeNumber } from "@applocale/functions/functions";
import { useTranslations } from "next-intl";

export interface ViewsProps {
    counter: number; 
}

export default function Views({counter}: ViewsProps) {
    const t = useTranslations('ui.text');
    const views = counter ?? 0;

    return (
        <div>
            <i className="bi bi-eye"></i>
            <span className="txtviews">
                {t('txtviews', {views: shortenLargeNumber(views, 1)}) ?? `Views: ${shortenLargeNumber(views, 1)}`}
            </span>
        </div>
    );
}