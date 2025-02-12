/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Posts } from "@/app/interfaces/posts";
import styles from "@/app/page.module.scss";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import EditNewsForm from "@/app/components/forms/editnews/editnews";
import FetchDataAxios from "@/app/utils/fetchdataaxios";
import Link from "next/link";

export default function EditNews() {
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
      <div className='container'>
        <div className='row justify-content-center align-items-center p-3'>
          <div className='col-12 card p-3 text-center'>
            <div className='card-body'>
              <i className="bi-clock" style={{ fontSize: "4rem" }}></i>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
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
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`}>Back</Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getBackLink = (pathname: any): any => {
    return (
      <div className="col-12 mt-3 mx-auto text-center">
        <Link href={pathname !== "/pages/news" ? "/pages/news" : "/"} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block">
          Back
        </Link>
      </div>
    );
  };

  return (
    <div className={styles.page} id="editnewsmpage" style={{ padding: '5rem 15px 0rem 15px' }}>
      <Header />
      <section className={styles.section + " " + styles.pstretch}>
        {!news && getEmptyNews(pathname)}

        {!!news && (
          <EditNewsForm id={parseInt("" + id, 0)} data={news} />
        )}

        {pathname !== "/" && getBackLink(pathname)}
      </section>
      <Footer />
    </div>
  );
}