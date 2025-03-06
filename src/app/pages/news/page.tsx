import styles from "@/app/page.module.scss";
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";
import NewsPaginated from "@/app/components/newspaginated";

export default function AllNewsPage() {
  return (
    <div className={styles.page} id="mallnewspage" style={{paddingTop: '5rem'}}>
    <Header />
    <section>
    <NewsPaginated cid={-1} pid={-1} />
    </section>
    <Footer />
    </div>
  );
}