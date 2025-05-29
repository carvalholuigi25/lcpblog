"use client";
import { useLocale, useTranslations } from 'next-intl';
import {Link} from '@/app/i18n/navigation';
import styles from "@applocale/page.module.scss";
import RegForm from "@applocale/components/ui/forms/register/regform";
import { getDefLocale } from '@applocale/helpers/defLocale';

export default function Register() {
  const treg = useTranslations("pages.RegisterPage");
  const locale = useLocale() ?? getDefLocale();
  
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

              <Link href={"/auth/login"} className="text-center mt-3" locale={locale}>
                {treg("lnkrecac") ?? "Already have an account? Login here"}
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
