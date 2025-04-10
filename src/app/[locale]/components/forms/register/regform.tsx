/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {Link} from '@/app/i18n/navigation';
import axios from "axios";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { getFromStorage } from "@applocale/hooks/localstorage";
import styles from "@applocale/page.module.scss";
import RegFormStep1 from "./rfstep1";
import RegFormStep2 from "./rfstep2";
import RegFormStep3 from "./rfstep3";
import Stepper from './stepper';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { useTranslations } from 'next-intl';

const RegForm = () => {
  const t = useTranslations("ui.forms.auth.register");
  const tbtn = useTranslations("ui.buttons");
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayname: '',
    password: '',
    passwordConfirm: '',
    dateBirthday: new Date().toISOString(),
    termsandcond: false
  });

  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logInfo] = useState(getFromStorage("logInfo"));
  const { push } = useRouter();

  useEffect(() => {
    if(logInfo) {
      setIsLoggedIn(true);
    }
  }, [logInfo]);

  const clearForm = () => {
    setFormData({
      username: '',
      email: '',
      displayname: '',
      password: '',
      passwordConfirm: '',
      dateBirthday: new Date().toISOString(),
      termsandcond: false
    });
  }

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChange = (e: any) => {
    const { name, value, checked } = e.target;
    setFormData({ ...formData, [name]: (name === 'termsandcond' ? checked : value) });
  }

  const handleFinish = async (data: any) => {
    setFormData({ ...formData, ...data });

    try {
      await axios({
        url: `${process.env.apiURL}/api/users`,
        method: 'post',
        data: formData
      }).then((r) => {
        const { userId, displayName, username, email, role } = r.data;
        const datax: any = [{
          userId: userId,
          username: username,
          email: email,
          displayName: displayName,
          role: role ?? 'user'
        }];

        console.log(datax);
        alert("You've been registered as " + (displayName ?? username ?? email));
        clearForm();

        setTimeout(() => {
          push('/');
        }, 500);
      }).catch((err) => {
        console.error(err);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getDisplayName = () => {
    return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].displayName : null;
  };

  return (
    <>
      {!!isLoggedIn && (
        <div className="col-12 mx-auto">
          <div className="card">
            <div className="card-body">
              <h3>{t("title") ?? "Register"}</h3>
              <p>{t("warnings.lblloggedin") ?? `You already registered in as ${getDisplayName()}!`}</p>
              <Link className="btn btn-primary ms-3 mt-3" href={'/'} locale={getDefLocale()}>
                {tbtn("btnback") ?? "Back"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className={styles.frmreg}>
          <Stepper currentStep={step} />
          {step === 1 && <RegFormStep1 onNext={handleNext} onChange={handleChange} />}
          {step === 2 && <RegFormStep2 onNext={handleNext} onBack={handleBack} onChange={handleChange} />}
          {step === 3 && <RegFormStep3 onFinish={handleFinish} onBack={handleBack} onClear={clearForm} onChange={handleChange} />}
        </div>
      )}
    </>
  );
};

export default RegForm;
