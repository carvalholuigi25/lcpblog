/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from '@/app/i18n/navigation';
import { Posts } from "@applocale/interfaces/posts";
import { getDefLocale } from '@applocale/helpers/defLocale';
import { useMySuffix } from "@applocale/hooks/suffixes";
import FetchData from "@applocale/utils/fetchdata";
import LoadingComp from "@applocale/components/ui/loadingcomp";

export default function SearchData({locale}: {locale: string}) {
    const t = useTranslations("ui.modals.search");
    const newsSuffix = useMySuffix("news");
    const sparams = useSearchParams();
    const search = sparams.get('search');
    const alocale = locale ?? getDefLocale();

    const [news, setNews] = useState(new Array<Posts>());
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        async function fetchSearch() {
            const data = await FetchData({
                url: `api/posts?search=${search}&sortby=title&op=contains&fieldname=title`,
                method: 'get',
                reqAuthorize: false
            });

            if(data.data) {
                setNews(JSON.parse(JSON.stringify(data.data)));
            }

            setLoading(false);
        }

        fetchSearch();
    }, [search]);
    
    if (loading || !search) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const fetchSearchItems = (): any => {
        const items: any[] = [];

        news.map((nitem, i) => {
            items.push(
                <div key={i}>
                    <ul>
                        <li>
                            <Link href={`/${newsSuffix}/${nitem.categoryId}/${nitem.postId}`} locale={alocale}>
                                {nitem.title}
                            </Link>
                        </li>
                    </ul>
                </div>
            );
        });

        return ( 
            <>
                {items && (
                    <div>
                        <p>{t("lblsrchfor", {search: ""+search}) ?? `You are searching for: ${search}`}</p>
                        {items}
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <Suspense fallback={<LoadingComp type="icon" icontype="ring" />}>
                {!news || news.length == 0 && <p>{t("lblsrchnodata") ?? "No data!"}</p>}
                {!!news && news.length > 0 && fetchSearchItems()}
            </Suspense>
        </>
    );
}