/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import AddNewsForm from "@applocale/components/ui/forms/crud/news/add/add";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { use } from "react";

export default function AddNews({ params }: { params: any }) {
  const {locale}: any = use(params);
  return (
    <div className={"npage " + styles.page} id="addnewsmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        <AddNewsForm />
      </section>
      <Footer />
    </div>
  );
}