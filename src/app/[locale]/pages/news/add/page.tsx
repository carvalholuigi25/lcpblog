import styles from "@applocale/page.module.scss";
import AddNewsForm from "@applocale/components/forms/crud/news/add/add";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";

export default function AddNews() {
  return (
    <div className={styles.page} id="addnewsmpage" style={{paddingTop: '5rem'}}>
        <Header />
        <section className={styles.section + " " + styles.pstretch}>
            <AddNewsForm />    
        </section>
        <Footer />
    </div>
  );
}