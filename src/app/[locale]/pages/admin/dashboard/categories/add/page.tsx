import styles from "@applocale/page.module.scss";
import { getDefLocale } from "@applocale/helpers/defLocale";
import AddCategoriesForm from "@applocale/components/forms/crud/categories/add/add";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";

export default function AddCategories({ locale }: { locale: string }) {
  return (
    <div className={styles.page} id="addcategoriesmpage" style={{ paddingTop: '5rem' }}>
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        <AddCategoriesForm />
      </section>
      <Footer />
    </div>
  );
}