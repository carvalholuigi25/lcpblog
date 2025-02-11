import styles from "@/app/page.module.scss";
import AddNewsForm from "@/app/components/forms/addnews/addnews";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";

export default function AddNews() {
  return (
    <div className={styles.page} id="addnewsmpage" style={{padding: '5rem 15px 0rem 15px'}}>
        <Header />
        <section className={styles.section + " " + styles.pstretch}>
            <AddNewsForm />    
        </section>
        <Footer />
    </div>
  );
}