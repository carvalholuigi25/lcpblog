"use client";
import { useParams } from 'next/navigation';
import styles from "@applocale/page.module.scss";
import News from '@applocale/components/news';
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import { getDefLocale } from '@/app/[locale]/helpers/defLocale';

export default function NewsPage({locale}: {locale: string}) {
  const { cid } = useParams();

  return (    
    <div className={styles.page} id="mallnewspage" style={{paddingTop: '5rem'}}>
    <Header locale={locale ?? getDefLocale()} />
    <section>
    <News locale={locale ?? getDefLocale()} cid={parseInt(""+cid, 0)} pid={-1} />
    </section>
    <Footer />
    </div>
  );
}