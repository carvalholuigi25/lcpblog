import styles from "@/app/page.module.scss";
import AddNewsForm from "@/app/components/forms/crud/news/add/add";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";

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