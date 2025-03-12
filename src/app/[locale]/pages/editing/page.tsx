import MyEditor from "@applocale/components/editor/myeditor";
import styles from "@applocale/page.module.scss";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";

export default function EditingPage() {
  return (
    <div className={styles.page} id="editingpage" style={{ paddingTop: '5rem' }}>
      <Header />
      <section>
        <MyEditor />
      </section>
      <Footer />
    </div>
  );
}