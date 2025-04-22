/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { Comments } from "@applocale/interfaces/comments";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useLocale } from "next-intl";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import EditCommentsForm from "@applocale/components/forms/crud/comments/edit/edit";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";

export default function EditComments() {
  const locale = useLocale();
  const { commentId } = useParams();
  const [Comments, setComments] = useState(null as unknown as Comments);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchComments() {
      const ndata = await FetchDataAxios({
        url: 'api/comments/' + commentId,
        method: 'get',
        reqAuthorize: false
      });

      const Commentsdata = ndata.data ?? ndata;
      setComments(JSON.parse(JSON.stringify(Commentsdata)));
      setLoading(false);
    }
    fetchComments()
  }, [commentId, loading]);

  if (loading) {
    return (
      <LoadingComp type="icon" icontype="ring" />
    );
  }

  const getEmptyComments = (pathname: any): any => {
    return (
      <div className='col-12'>
        <div className="card p-3 text-center">
          <div className='card-body'>
            <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
            <p>0 Comments</p>
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
        <Link href={pathname !== "/pages/Comments" ? "/pages/Comments" : "/"} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block" locale={locale ?? getDefLocale()}>
          Back
        </Link>
      </div>
    );
  };

  return (
    <div className={styles.page} id="editCommentsmpage" style={{ paddingTop: '5rem' }}>
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        {!Comments && getEmptyComments(pathname)}

        {!!Comments && (
          <EditCommentsForm commentid={parseInt("" + commentId, 0)} data={Comments} />
        )}

        {pathname !== "/" && pathname !== "/" + getDefLocale() + "/pages/comments/edit/"+commentId && getBackLink(pathname)}
      </section>
      <Footer />
    </div>
  );
}