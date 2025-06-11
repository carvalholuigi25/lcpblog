/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from 'next/navigation';
import { getDefLocale } from '@applocale/helpers/defLocale';
import styles from "@applocale/page.module.scss";
import News from '@applocale/components/ui/news';
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import { use } from 'react';

export default function AllNewsPage({ params }: { params: any }) {
  const {locale}: any = use(params);
  const { cid } = useParams();

  return (    
    <div className={"npage " + styles.page} id="mallnewspage">
    <Header locale={locale ?? getDefLocale()} />
    <section>
    <News locale={locale ?? getDefLocale()} cid={parseInt(""+cid, 0)} pid={-1} />
    </section>
    <Footer />
    </div>
  );
}