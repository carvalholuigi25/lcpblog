"use client";
import styles from "@/app/page.module.scss";
import { useParams } from 'next/navigation';
import News from '@/app/components/news';
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";

export default function NewsPage() {
  const { id } = useParams();

  return (    
    <div className={styles.page} id="mallnewspage" style={{padding: '5rem 15px 0rem 15px'}}>
    <Header />
    <section>
    <News pid={parseInt(""+id, 0)} />
    </section>
    <Footer />
    </div>
  );
}