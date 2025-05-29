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
    
    const alocale = locale ?? getDefLocale();
    
    const [news, setNews] = useState(new Array<Posts>());
    const [loading, setLoading] = useState(true);
    const sparams = useSearchParams();
    const search = sparams.get('search');
    
    useEffect(() => {
        async function fetchSearch() {
            const data = await FetchData({
                url: `api/posts?search=${search}&sortby=title&op=contains&fieldname=title`,
                method: 'get',
                reqAuthorize: false
            });

            if(data.data) {
                setNews(JSON.parse(JSON.stringify(data.data)));
                setLoading(false);
            }
        }

        fetchSearch();
    }, [loading, search]);

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
                <div>
                    {search && (
                        <>
                            <p>{t("lblsrchfor", {search: ""+search}) ?? `You are searching for: ${search}`}</p>
                            {items}
                        </>
                    )}

                    {!search && (
                        <LoadingComp type="icon" icontype="ring" />
                    )}
                </div>
            </>
        );
    }

    return (
        <Suspense>
            {!loading && fetchSearchItems()}

            {!!loading && (
                <LoadingComp type="icon" icontype="ring" />
            )}
        </Suspense>
    );
}