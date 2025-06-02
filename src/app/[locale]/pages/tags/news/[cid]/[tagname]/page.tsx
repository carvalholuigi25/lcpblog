/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from 'next/navigation';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { use } from 'react';
import styles from "@applocale/page.module.scss";
import News from '@applocale/components/ui/news';
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";

export default function TagsPage({ params }: { params: any }) {
  const {locale}: any = use(params);
  // const locale = useLocale();
  const { cid, tagname } = useParams();

  return (    
    <div className={"npage " + styles.page} id="mallnewspage">
      <Header locale={locale ?? getDefLocale()} />
      <section>
        <News locale={locale ?? getDefLocale()} cid={parseInt(""+cid, 0)} pid={-1} tagname={""+tagname} />
      </section>
      <Footer />
    </div>
  );
}