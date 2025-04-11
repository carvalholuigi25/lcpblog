"use client";
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { getDefLocale } from '@applocale/helpers/defLocale';
import styles from "@applocale/page.module.scss";
import News from '@applocale/components/news';
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";

export default function NewsPage() {
  const locale = useLocale();
  const { cid, id } = useParams();

  return (    
    <div className={styles.page} id="mallnewspage" style={{paddingTop: '5rem'}}>
    <Header locale={locale ?? getDefLocale()} />
    <section>
    <News locale={locale ?? getDefLocale()} cid={parseInt(""+cid, 0)} pid={parseInt(""+id, 0)} />
    </section>
    <Footer />
    </div>
  );
}