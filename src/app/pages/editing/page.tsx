import MyEditor from "@/app/components/editor/myeditor";
import styles from "@/app/page.module.scss";
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";

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