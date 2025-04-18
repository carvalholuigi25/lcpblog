"use client";
import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getDefLocale } from "@applocale/helpers/defLocale";
import styles from "@applocale/page.module.scss";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import News from "@applocale/components/news";

export default function Home() {
  const locale = useLocale();
  const t = useTranslations('pages.HomePage');
  
  return (
    <div className={styles.page} id="home">
      <Header locale={locale ?? getDefLocale()} />
      <main className={styles.main}>
        <h1>LCP Blog</h1>
        <h2 className="mt-2">{t('title')}</h2>
      </main>
      <section className={styles.section + " " + styles.pstretch}>
        <Suspense>
        <News locale={locale ?? getDefLocale()} cid={-1} pid={-1} />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
