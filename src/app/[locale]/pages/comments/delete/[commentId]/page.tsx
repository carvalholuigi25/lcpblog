/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { Comments as Comments } from "@applocale/interfaces/comments";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useLocale, useTranslations } from "next-intl";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import DeleteCommentsForm from "@applocale/components/ui/forms/crud/comments/delete/delete";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/ui/loadingcomp";

export default function DeleteComments() {
  const t = useTranslations("pages.DeleteCommentsPage");
  const tbtn = useTranslations("ui.buttons");
  const locale = useLocale();
  const { commentId } = useParams();
  const [comments, setComments] = useState(null as unknown as Comments);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchComments() {
      const ndata = await FetchDataAxios({
        url: 'api/comments/' + commentId,
        method: 'get',
        reqAuthorize:  process.env.NODE_ENV === "production" ? true : false
      });

      const commentsdata = ndata.data ?? ndata;
      setComments(JSON.parse(JSON.stringify(commentsdata)));
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
            <p>{t('emptycomments') ?? "0 comments"}</p>
            {pathname !== "/" && (
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>
                {tbtn("btnback") ?? "Back"}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getBackLink = (): any => {
    return (
      <div className="col-12 mt-3 mx-auto text-center">
        <Link href={"/"} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block" locale={locale ?? getDefLocale()}>
          {tbtn("btnback") ?? "Back"}
        </Link>
      </div>
    );
  };

  return (
    <div className={"npage " + styles.page} id="deletecommentsmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        {!comments && getEmptyComments(pathname)}

        {!!comments && (
          <>
            <DeleteCommentsForm commentId={parseInt("" + commentId, 0)} data={comments} />
          </>
        )}

        {pathname !== "/" && getBackLink()}
      </section>
      <Footer />
    </div>
  );
}