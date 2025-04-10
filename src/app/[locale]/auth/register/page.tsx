"use client";
import { useTranslations } from 'next-intl';
import {Link} from '@/app/i18n/navigation';
import styles from "@applocale/page.module.scss";
import RegForm from "@applocale/components/forms/register/regform";

export default function Register() {
  const treg = useTranslations("pages.RegisterPage");
  
  return (
    <div className={styles.page + " " + styles.pregister} id="register">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <section className={styles.section + " " + styles.sregister}>
              <div className={styles.sregistertitle}>
                <i className={"bi bi-person-circle " + styles.sregistertitleico}></i>
                <h1 className={styles.sregistertitletxt}>
                  {treg('title') ?? "Register"}
                </h1>
              </div>

              <RegForm />

              <Link href={"/auth/login"} className="text-center mt-3">
                {treg("lnkrecac") ?? "Already have an account? Login here"}
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
