/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMySchemaRegStep1, type TFormRegDataStep1 } from "@applocale/schemas/formSchemas";
import ShowAlert from "@/app/[locale]/components/ui/alerts";

const RegFormStep1 = ({ onNext, onChange }: any) => {
  const t = useTranslations("ui.forms.auth.register.step1");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TFormRegDataStep1>({
    resolver: zodResolver(useMySchemaRegStep1()),
  });

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <form className={styles.frmregstep} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.sregistertitlefrm}>
        <h3 className={styles.sregistertitlefrmtxt + " text-center"}>
          {t("title") ?? "Step 1: User Data"}
        </h3>
      </div>

      <div className="form-group mt-3 text-center">
        <label htmlFor="email">{t("lblemail") ?? "Email"}</label>
        <div className={styles.sformgroup}>
          <i className={"bi bi-envelope " + styles.sformgroupico}></i>
          <input type="email" {...register("email")} id="email" className={"form-control email mt-3 " + styles.sformgroupinp} placeholder={t("inpemail") ?? "Write your email here..."} onChange={onChange} />
        </div>

        {errors.email && ShowAlert("danger", errors.email.message)}
      </div>

      <div className="form-group mt-3 text-center">
        <label htmlFor="username">{t("lblusername") ?? "Username"}</label>
        <div className={styles.sformgroup}>
          <i className={"bi bi-person-lines-fill " + styles.sformgroupico}></i>
          <input type="username" {...register("username")} id="username" className={"form-control username mt-3 " + styles.sformgroupinp} placeholder={t("inpusername") ?? "Write your username here..."} onChange={onChange} />
        </div>

        {errors.username && ShowAlert("danger", errors.username.message)}
      </div>

      <div className="form-group mt-3 text-center">
        <label htmlFor="displayname">{t("lbldisplayname") ?? "Display name"}</label>
        <div className={styles.sformgroup}>
          <i className={"bi bi-display " + styles.sformgroupico}></i>
          <input type="text" {...register("displayname")} id="displayname" className={"form-control displayname mt-3 " + styles.sformgroupinp} placeholder={t("inpdisplayname") ?? "Write your display name here..."} onChange={onChange} />
        </div>

        {errors.displayname && ShowAlert("danger", errors.displayname.message)}
      </div>

      <div className="d-inline-block mx-auto mt-3">
        <button className="btn btn-primary btn-rounded btnnext mt-3" type="submit" disabled={isSubmitting}>
          {t("btnnext") ?? "Next"}
        </button>
      </div>
    </form>
  );
};

export default RegFormStep1;
