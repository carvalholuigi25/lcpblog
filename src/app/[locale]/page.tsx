"use client";
import { Suspense } from "react";
import {useTranslations} from 'next-intl';
import styles from "@/app/page.module.scss";
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";
import News from "@/app/components/news";

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div className={styles.page} id="home">
      <Header />
      <main className={styles.main}>
        <h1>LCP Blog</h1>
        <h2 className="mt-2">{t('title')}</h2>
      </main>
      <section className={styles.section + " " + styles.pstretch}>
        <Suspense>
        <News cid={-1} pid={-1} />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
