import Editor from "@/app/components/editor";
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";
import styles from "@/app/page.module.scss";

export default function EditingPage() {
    return (
        <div className={styles.page} id="editing">
            <Header />
            <section className={styles.section + " " + styles.pstretch} style={{ padding: '5rem 15px' }}>
                <Editor />
            </section>
            <Footer />
        </div>
    );
}