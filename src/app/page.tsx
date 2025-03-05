"use client";
// import { useEffect } from "react";
// import { startConnection, getConnection, disposeConnection } from "./services/signalr.service";
import styles from "@/app/page.module.scss";
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";
import News from "@/app/components/news";

export default function Home() {
  return (
    <div className={styles.page} id="home">
      <Header />
      <main className={styles.main}>
        <h1>LCP Blog</h1>
      </main>
      <section className={styles.section + " " + styles.pstretch}>
        <News cid={-1} pid={-1} />
      </section>
      <Footer />
    </div>
  );
}
