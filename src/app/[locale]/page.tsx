"use client";
import styles from "@applocale/page.module.scss";
import Image from 'next/image';
import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { getImagePath } from "./functions/functions";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import News from "@applocale/components/ui/news";
import { getConfigSync } from "./utils/config";

export default function Home() {
  const is3DEffectsEnabled = getConfigSync().is3DEffectsEnabled;
  const locale = useLocale() ?? getDefLocale();
  const t = useTranslations('pages.HomePage');
  
  return (
    <div className={styles.page} id="home">
      <Header locale={locale} />
      <main className={styles.main}>
        <div className={"mlogo " + (is3DEffectsEnabled ? "logo3D" : "")}>
          <Image src={getImagePath("logos/logo.svg")} alt={"LCPBlog's logo"} width={345} height={79} className="card-img-top img-fluid logo" />
        </div>
        <h2 className={"mt-2 " + (is3DEffectsEnabled ? "title3D" : "")}>{t('title') ?? "Welcome to LCPBlog!"}</h2>
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
