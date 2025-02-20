"use client";
// import { useEffect } from "react";
// import { startConnection, getConnection, disposeConnection } from "./services/signalr.service";
import styles from "@/app/page.module.scss";
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";
import News from "@/app/components/news";
import useMyHub from "./hooks/hub";

export default function Home() {
  // useEffect(() => {
  //   startConnection("datahub", true).then(async () => {
  //     const connection = await getConnection();
  //     connection.on('ReceiveMessage', async () => {
  //       console.log('Received');               
  //     });
  //   });

  //   return () => {
  //     disposeConnection();
  //   };
  // }, []);

  useMyHub('datahub', true);
  
  return (
    <div className={styles.page} id="home">
      <Header />
      <main className={styles.main}>
        <h1>LCP Blog</h1>
      </main>
      <section className={styles.section + " " + styles.pstretch}>
        <News pid={-1} />
      </section>
      <Footer />
    </div>
  );
}
