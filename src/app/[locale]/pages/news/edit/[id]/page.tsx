/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Posts } from "@applocale/interfaces/posts";
import styles from "@applocale/page.module.scss";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import EditNewsForm from "@applocale/components/forms/crud/news/edit/edit";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import {Link} from '@/app/i18n/navigation';
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";
import { useLocale } from "next-intl";
import LoadingComp from "@/app/[locale]/components/loadingcomp";

export default function EditNews() {
  const locale = useLocale();
  const { id } = useParams();
  const [news, setNews] = useState(null as unknown as Posts);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchNews() {
      const ndata = await FetchDataAxios({
        url: 'api/posts/' + id,
        method: 'get',
        reqAuthorize: false
      });

      const newsdata = ndata.data ?? ndata;
      setNews(JSON.parse(JSON.stringify(newsdata)));
      setLoading(false);
    }
    fetchNews()
  }, [id, loading]);

  if (loading) {
    return (
      <LoadingComp type="icon" icontype="ring" />
    );
  }

  const getEmptyNews = (pathname: any): any => {
    return (
      <div className='col-12'>
        <div className="card p-3 text-center">
          <div className='card-body'>
            <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
            <p>0 news</p>
            {pathname !== "/" && (
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>Back</Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getBackLink = (pathname: any): any => {
    return (
      <div className="col-12 mt-3 mx-auto text-center">
        <Link href={pathname !== "/pages/news" ? "/pages/news" : "/"} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block" locale={locale ?? getDefLocale()}>
          Back
        </Link>
      </div>
    );
  };

  return (
    <div className={styles.page} id="editnewsmpage" style={{ paddingTop: '5rem' }}>
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        {!news && getEmptyNews(pathname)}

        {!!news && (
          <EditNewsForm id={parseInt("" + id, 0)} data={news} />
        )}

        {pathname !== "/" && pathname !== "/" + getDefLocale() + "/pages/news/edit/"+id && getBackLink(pathname)}
      </section>
      <Footer />
    </div>
  );
}