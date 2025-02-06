"use client";
import styles from "@/app/page.module.scss";
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";
import Editor from "@/app/components/editor/myeditor";

export default function Editing() {
    return (
        <div className={styles.page} id="editing">
            <Header />
            <section className={styles.section + " " + styles.pstretch} style={{marginTop: "5rem"}}>
                <Editor />
            </section>
            <Footer />
        </div>
    )
}