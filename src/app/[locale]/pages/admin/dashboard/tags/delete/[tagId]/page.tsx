/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Tags } from "@applocale/interfaces/tags";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { Link } from '@/app/i18n/navigation';
import { useLocale, useTranslations } from "next-intl";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import DeleteTagsForm from "@/app/[locale]/components/ui/forms/crud/tags/delete/delete";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@/app/[locale]/components/ui/loadingcomp";

export default function DeleteTags() {
  const t = useTranslations("ui.forms.crud.tags.delete");
  const tbtn = useTranslations("ui.buttons");

  const locale = useLocale();
  const { tagId } = useParams();
  const [tags, setTags] = useState(null as unknown as Tags);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchTags() {
      const ndata = await FetchDataAxios({
        url: 'api/tags/' + tagId,
        method: 'get',
        reqAuthorize: false
      });

      const tagsdata = ndata.data ?? ndata;
      setTags(JSON.parse(JSON.stringify(tagsdata)));
      setLoading(false);
    }
    fetchTags()
  }, [tagId, loading]);

  if (loading) {
    return (
      <LoadingComp type="icon" icontype="ring" />
    );
  }

  const getEmptyTags = (pathname: any): any => {
    return (
      <div className='col-12'>
        <div className="card p-3 text-center">
          <div className='card-body'>
            <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
            <p>{t('emptytags') ?? "0 tags"}</p>
            {pathname !== "/" && (
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>
                {tbtn('btnback') ?? "Back"}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getBackLink = (pathname: any): any => {
    return (
      <div className="col-12 mt-3 mx-auto text-center">
        <Link href={pathname !== "/pages/tags" ? "/pages/tags" : "/"} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block" locale={locale ?? getDefLocale()}>
          {tbtn('btnback') ?? "Back"}
        </Link>
      </div>
    );
  };

  return (
    <div className={styles.page} id="DeleteTagsmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        {!tags && getEmptyTags(pathname)}

        {!!tags && (
          <>
            <DeleteTagsForm id={parseInt("" + tagId, 0)} data={tags} />
          </>
        )}

        {pathname !== "/" && getBackLink(pathname)}
      </section>
      <Footer />
    </div>
  );
}