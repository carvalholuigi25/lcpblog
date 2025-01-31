/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@/app/page.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fregstep2Schema, TFormRegDataStep2 } from "@/app/schemas/formSchemas";
import ShowAlert from "@/app/components/alerts";

const RegFormStep2 = ({ onBack, onNext, onChange }: any) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TFormRegDataStep2>({
    resolver: zodResolver(fregstep2Schema),
  });

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <form className={styles.frmregstep} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.sregistertitlefrm}>
        <h3 className={styles.sregistertitlefrmtxt + " text-center"}>Step 2: Personal Data</h3>
      </div>
      
      <div className="form-group mt-3 text-center">
        <label htmlFor="password">Password</label>
        <div className={styles.sformgroup}>
          <i className={"bi bi-pass " + styles.sformgroupico}></i>
          <input type="password" {...register("password")} id="password" className={"form-control password mt-3 " + styles.sformgroupinp} placeholder="Write your password here..." onChange={onChange} required />
        </div>

        {errors.password && ShowAlert("danger", errors.password.message)}
      </div>

      <div className="form-group mt-3 text-center">
        <label htmlFor="confirmpassword">Confirm Password</label>
        <div className={styles.sformgroup}>
          <i className={"bi bi-pass " + styles.sformgroupico}></i>
          <input type="password" {...register("passwordConfirm")} id="passwordConfirm" className={"form-control confirmpassword mt-3 " + styles.sformgroupinp} placeholder="Confirm your password here..." onChange={onChange} required />
        </div>

        {errors.passwordConfirm && ShowAlert("danger", errors.passwordConfirm.message)}
      </div>

      <div className="form-group mt-3 text-center">
        <label htmlFor="dateBirthday">Date of Birthday</label>
        <div className={styles.sformgroup}>
          <i className={"bi bi-calendar-date " + styles.sformgroupico}></i>
          <input type="date" {...register("dateBirthday")} id="dateBirthday" className={"form-control dateBirthday mt-3 " + styles.sformgroupinp} step="-1" onChange={onChange} required />
        </div>

        {errors.dateBirthday && ShowAlert("danger", errors.dateBirthday.message)}
      </div>

      <div className="d-inline-block mx-auto mt-3">
        <button className="btn btn-primary btnprev btn-rounded" type="button" onClick={onBack}>Previous</button>
        <button className="btn btn-primary btnnext btn-rounded ms-3" type="submit" disabled={isSubmitting}>Next</button>
      </div>
    </form>
  );
};

export default RegFormStep2;
