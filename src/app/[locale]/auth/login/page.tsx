import styles from "@applocale/page.module.scss";
import LoginForm from "@applocale/components/forms/login/loginform";

export default function Login() {
  return (
    <div className={styles.page + " " + styles.plogin} id="login">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <section className={styles.section + " " + styles.slogin}>
              <div className={styles.slogintitle}>
                <i className={"bi bi-person-circle " + styles.slogintitleico}></i>
                <h1 className={styles.slogintitletxt}>Login</h1>
              </div>

              <LoginForm />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
