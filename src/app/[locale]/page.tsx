"use client";
import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getDefLocale } from "@applocale/helpers/defLocale";
import styles from "@applocale/page.module.scss";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import News from "@applocale/components/news";

export default function Home() {
  const locale = useLocale() ?? getDefLocale();
  const t = useTranslations('pages.HomePage');
  const is3DEffectsEnabled = process.env.NEXT_PUBLIC_is3DEffectsEnabled == "true" ? true : false;
  
  return (
    <div className={styles.page} id="home">
      <Header locale={locale} />
      <main className={styles.main}>
        <h1 className={"logo " + (is3DEffectsEnabled ? "logo-3D" : "")}>LCP Blog</h1>
        <h2 className={"mt-2 " + (is3DEffectsEnabled ? "title-3D" : "")}>{t('title') ?? "Welcome to LCPBlog!"}</h2>
      </main>
      <section className={styles.section + " " + styles.pstretch}>
        <Suspense>
          <News locale={locale} cid={-1} pid={-1} />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
