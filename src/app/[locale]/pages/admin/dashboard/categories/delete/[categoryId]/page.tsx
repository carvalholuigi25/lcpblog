/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Categories } from "@applocale/interfaces/categories";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { Link } from '@/app/i18n/navigation';
import { useLocale, useTranslations } from "next-intl";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import DeleteCategoriesForm from "@applocale/components/forms/crud/categories/delete/delete";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";

export default function DeleteCategories() {
  const t = useTranslations("ui.forms.crud.categories.delete");
  const tbtn = useTranslations("ui.buttons");

  const locale = useLocale();
  const { categoryId } = useParams();
  const [categories, setCategories] = useState(null as unknown as Categories);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCategories() {
      const ndata = await FetchDataAxios({
        url: 'api/categories/' + categoryId,
        method: 'get',
        reqAuthorize: false
      });

      const categoriesdata = ndata.data ?? ndata;
      setCategories(JSON.parse(JSON.stringify(categoriesdata)));
      setLoading(false);
    }
    fetchCategories()
  }, [categoryId, loading]);

  if (loading) {
    return (
      <LoadingComp type="icon" icontype="ring" />
    );
  }

  const getEmptyCategories = (pathname: any): any => {
    return (
      <div className='col-12'>
        <div className="card p-3 text-center">
          <div className='card-body'>
            <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
            <p>{t('emptycategories') ?? "0 categories"}</p>
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
        <Link href={pathname !== "/pages/categories" ? "/pages/categories" : "/"} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block" locale={locale ?? getDefLocale()}>
          {tbtn('btnback') ?? "Back"}
        </Link>
      </div>
    );
  };

  return (
    <div className={styles.page} id="DeleteCategoriesmpage" style={{ paddingTop: '5rem' }}>
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        {!categories && getEmptyCategories(pathname)}

        {!!categories && (
          <>
            <DeleteCategoriesForm id={parseInt("" + categoryId, 0)} data={categories} />
          </>
        )}

        {pathname !== "/" && getBackLink(pathname)}
      </section>
      <Footer />
    </div>
  );
}