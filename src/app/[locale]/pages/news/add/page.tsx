import styles from "@applocale/page.module.scss";
import AddNewsForm from "@/app/[locale]/components/ui/forms/crud/news/add/add";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import { getDefLocale } from "@applocale/helpers/defLocale";

export default function AddNews({ locale }: { locale: string }) {
  return (
    <div className={styles.page} id="addnewsmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        <AddNewsForm />
      </section>
      <Footer />
    </div>
  );
}