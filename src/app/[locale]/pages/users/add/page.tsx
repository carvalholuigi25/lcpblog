/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import AddUsersForm from "@applocale/components/ui/forms/crud/users/add/add";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { use } from "react";

export default function AddUsers({ params }: { params: any }) {
  const {locale}: any = use(params);
  return (
    <div className={"npage " + styles.page} id="addusersmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        <AddUsersForm />
      </section>
      <Footer />
    </div>
  );
}