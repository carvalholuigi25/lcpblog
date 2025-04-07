/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { Posts } from "@applocale/interfaces/posts";
import { getDefLocale } from '@applocale/helpers/defLocale';
import FetchData from "@applocale/utils/fetchdata";
import LoadingComp from "@applocale/components/loadingcomp";

export default function SearchData({locale}: {locale: string}) {
    const [news, setNews] = useState(new Array<Posts>());
    const [loading, setLoading] = useState(true);
    const sparams = useSearchParams();
    const search = sparams.get('search');
    
    useEffect(() => {
        async function fetchSearch() {
            const data = await FetchData({
                url: `api/posts?search=${search}&sortby=title`,
                method: 'get',
                reqAuthorize: false
            });

            setNews(JSON.parse(JSON.stringify(data.data)));
            setLoading(false);
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
                            <Link href={'/pages/news/'+nitem.categoryId+'/'+nitem.postId} locale={locale ?? getDefLocale()}>
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
                    <p>You searched for: {search}</p>
                    {items}
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