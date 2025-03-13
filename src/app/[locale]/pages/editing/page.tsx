import MyEditor from "@applocale/components/editor/myeditor";
import styles from "@applocale/page.module.scss";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import { getDefLocale } from "../../helpers/defLocale";

export default function EditingPage({locale}: {locale: string}) {
  return (
    <div className={styles.page} id="editingpage" style={{ paddingTop: '5rem' }}>
      <Header locale={locale ?? getDefLocale()} />
      <section>
        <MyEditor />
      </section>
      <Footer />
    </div>
  );
}