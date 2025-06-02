/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import { use } from "react";
import { getDefLocale } from "@applocale/helpers/defLocale";
import AddCategoriesForm from "@applocale/components/ui/forms/crud/categories/add/add";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";

export default function AddCategories({ params }: { params: any }) {
  const {locale}: any = use(params);
  
  return (
    <div className={"admpage " + styles.page} id="addcategoriesmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        <AddCategoriesForm />
      </section>
      <Footer />
    </div>
  );
}