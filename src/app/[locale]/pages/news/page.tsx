/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, use } from "react";
import { getDefLocale } from "@applocale/helpers/defLocale";
import styles from "@applocale/page.module.scss";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import News from "@applocale/components/ui/news";

export default function AllNewsPage({ params }: { params: any }) {
  const {locale}: any = use(params);
  const vlocale = locale ?? getDefLocale();

  return (
    <div className={"npage " + styles.page} id="mallnewspage">
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