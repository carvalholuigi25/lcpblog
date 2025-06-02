/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import AddTagsForm from "@applocale/components/ui/forms/crud/tags/add/add";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { use } from "react";

export default function AddTags({ params }: { params: any }) {
  const {locale}: any = use(params);
  return (
    <div className={"admpage " + styles.page} id="addtagsmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        <AddTagsForm />
      </section>
      <Footer />
    </div>
  );
}