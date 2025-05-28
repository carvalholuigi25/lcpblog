/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMySchemaRegStep3, type TFormRegDataStep3 } from "@applocale/schemas/formSchemas";
import { useTranslations } from "next-intl";
import ShowAlert from "@/app/[locale]/components/ui/alerts";

const RegFormStep3 = ({ onFinish, onBack, onClear, onChange }: any) => {
  const t = useTranslations("ui.forms.auth.register.step3");
  
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TFormRegDataStep3>({
    resolver: zodResolver(useMySchemaRegStep3()),
  });

  const onSubmit = (data: any) => {
    onFinish(data);
  };

  return (
    <div>
      <form className={styles.frmregstep} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.sregistertitlefrm}>
          <h3 className={styles.sregistertitlefrmtxt + " text-center"}>
            {t("title") ?? "Step 3: Final steps"}  
          </h3>
        </div>

        <div className="form-group mt-3 text-center">
          <label htmlFor="termsandcon">{t("lblterms") ?? "Terms and conditions"}</label>
          <textarea name="txtterms" id="txtterms" className="txtterms form-control mt-3" rows={10} cols={1} placeholder={'1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt neque, aspernatur nobis vero amet voluptatibus officiis dolor, id impedit distinctio cupiditate totam libero esse! Vero libero molestiae doloremque hic fugiat.\n2. lorem \n3. lorem ipsum'} readOnly disabled />

          <div className="d-flex flex-row justify-content-center align-items-center mt-3">
            <input type="checkbox" {...register("termsandcond")} id="termsandcond" className={"form-control termsandcond m-0 p-0 " + styles.sregistertermsinp} onChange={onChange} required />
            <label htmlFor="termsandcond" className={"termsandcondtxt " + styles.sregistertermstxt}>
              {t("btnterms") ?? "I read and agree all the terms and conditions"}
            </label>
          </div>

          {errors.termsandcond && ShowAlert("danger", errors.termsandcond.message)}
        </div>

        <div className="d-inline-block mx-auto mt-3">
          <button className="btn btn-primary btnreset btn-rounded" type="button" onClick={onClear}>
            {t("btnreset") ?? "Reset"}
          </button>
          <button className="btn btn-primary btnprev btn-rounded ms-3" type="button" onClick={onBack}>
            {t("btnprevious") ?? "Previous"}
          </button>
          <button className="btn btn-primary btnreg btn-rounded ms-3" type="submit" disabled={isSubmitting}>
            {t("btnregister") ?? "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegFormStep3;
