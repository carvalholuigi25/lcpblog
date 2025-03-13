import styles from "@applocale/page.module.scss";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import News from "@applocale/components/news";
import { Suspense } from "react";
import { getDefLocale } from "../../helpers/defLocale";

export default function AllNewsPage({locale}: {locale: string}) {
  return (
    <div className={styles.page} id="mallnewspage" style={{paddingTop: '5rem'}}>
    <Header locale={locale ?? getDefLocale()} />
    <section>
    <Suspense>
    <News locale={locale ?? getDefLocale()} cid={-1} pid={-1} />
    </Suspense>
    </section>
    <Footer />
    </div>
  );
}