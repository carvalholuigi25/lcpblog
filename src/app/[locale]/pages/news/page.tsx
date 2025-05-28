import { Suspense } from "react";
import { getDefLocale } from "@applocale/helpers/defLocale";
import styles from "@applocale/page.module.scss";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import News from "@/app/[locale]/components/ui/news";

export default function AllNewsPage({locale}: {locale: string}) {
  const vlocale = locale ?? getDefLocale();

  return (
    <div className={styles.page} id="mallnewspage">
      <Header locale={vlocale} />
      <section>
        <Suspense>
          <News locale={vlocale} cid={-1} pid={-1} />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}