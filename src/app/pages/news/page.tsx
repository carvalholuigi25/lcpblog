import styles from "@/app/page.module.scss";
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";
import NewsPaginated from "@/app/components/newspaginated";
import { Suspense } from "react";

export default function AllNewsPage() {
  return (
    <div className={styles.page} id="mallnewspage" style={{paddingTop: '5rem'}}>
    <Header />
    <section>
    <Suspense>
    <NewsPaginated cid={-1} pid={-1} />
    </Suspense>
    </section>
    <Footer />
    </div>
  );
}