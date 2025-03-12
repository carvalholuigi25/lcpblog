import styles from "@applocale/page.module.scss";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import News from "@applocale/components/news";
import { Suspense } from "react";

export default function AllNewsPage() {
  return (
    <div className={styles.page} id="mallnewspage" style={{paddingTop: '5rem'}}>
    <Header />
    <section>
    <Suspense>
    <News cid={-1} pid={-1} />
    </Suspense>
    </section>
    <Footer />
    </div>
  );
}