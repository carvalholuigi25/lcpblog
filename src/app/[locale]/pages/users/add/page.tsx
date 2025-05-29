import styles from "@applocale/page.module.scss";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import AddUsersForm from "@applocale/components/ui/forms/crud/users/add/add";
import { getDefLocale } from "@applocale/helpers/defLocale";

export default function AddUsers({ locale }: { locale: string }) {
  return (
    <div className={"mpage " + styles.page} id="addusersmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        <AddUsersForm />
      </section>
      <Footer />
    </div>
  );
}