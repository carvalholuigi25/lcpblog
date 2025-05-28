import styles from "@applocale/page.module.scss";
import AddTagsForm from "@/app/[locale]/components/ui/forms/crud/tags/add/add";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import { getDefLocale } from "@applocale/helpers/defLocale";

export default function AddTags({ locale }: { locale: string }) {
  return (
    <div className={"mpage " + styles.page} id="addtagsmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        <AddTagsForm />
      </section>
      <Footer />
    </div>
  );
}