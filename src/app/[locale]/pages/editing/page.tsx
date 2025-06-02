/* eslint-disable @typescript-eslint/no-explicit-any */
import MyEditor from "@applocale/components/ui/editor/myeditor";
import styles from "@applocale/page.module.scss";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { use } from "react";

export default function EditingPage({ params }: { params: any }) {
  const {locale}: any = use(params);
  return (
    <div className={"npage " + styles.page} id="editingpage">
      <Header locale={locale ?? getDefLocale()} />
      <section>
        <MyEditor />
      </section>
      <Footer />
    </div>
  );
}