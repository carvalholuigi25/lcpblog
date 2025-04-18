/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Categories } from "@applocale/interfaces/categories";
import { useLocale } from "next-intl";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import EditCategoriesForm from "@applocale/components/forms/crud/categories/edit/edit";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";

export default function EditCategories() {
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
            <p>0 categories</p>
            {pathname !== "/" && (
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>Back</Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page} id="editcategoriesmpage" style={{ paddingTop: '5rem' }}>
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        {!categories && getEmptyCategories(pathname)}

        {!!categories && (
          <EditCategoriesForm categoryid={parseInt("" + categoryId, 0)} data={categories} />
        )}
      </section>
      <Footer />
    </div>
  );
}