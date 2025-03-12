"use client";
import { useParams } from 'next/navigation';
import styles from "@applocale/page.module.scss";
import News from '@applocale/components/news';
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";

export default function NewsPage() {
  const { cid } = useParams();

  return (    
    <div className={styles.page} id="mallnewspage" style={{paddingTop: '5rem'}}>
    <Header />
    <section>
    <News cid={parseInt(""+cid, 0)} pid={-1} />
    </section>
    <Footer />
    </div>
  );
}