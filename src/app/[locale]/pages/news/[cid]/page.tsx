"use client";
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { getDefLocale } from '@applocale/helpers/defLocale';
import styles from "@applocale/page.module.scss";
import News from '@/app/[locale]/components/ui/news';
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";

export default function NewsPage() {
  const locale = useLocale();
  const { cid } = useParams();

  return (    
    <div className={"mpage " + styles.page} id="mallnewspage">
    <Header locale={locale ?? getDefLocale()} />
    <section>
    <News locale={locale ?? getDefLocale()} cid={parseInt(""+cid, 0)} pid={-1} />
    </section>
    <Footer />
    </div>
  );
}