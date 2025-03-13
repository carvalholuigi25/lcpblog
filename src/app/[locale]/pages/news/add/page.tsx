import styles from "@applocale/page.module.scss";
import AddNewsForm from "@applocale/components/forms/crud/news/add/add";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";

export default function AddNews({ locale }: { locale: string }) {
  return (
    <div className={styles.page} id="addnewsmpage" style={{ paddingTop: '5rem' }}>
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        <AddNewsForm />
      </section>
      <Footer />
    </div>
  );
}