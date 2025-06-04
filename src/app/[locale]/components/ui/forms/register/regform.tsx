/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import axios from "axios";
import { useEffect, useState } from 'react';
import { Link } from '@/app/i18n/navigation';
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from 'next-intl';
import { getFromStorage } from "@applocale/hooks/localstorage";
import { getDefLocale } from '@applocale/helpers/defLocale';
import { DataToastsProps } from "@applocale/interfaces/toasts";
import Toasts from "@applocale/components/ui/toasts/toasts";
import RegFormStep1 from "./rfstep1";
import RegFormStep2 from "./rfstep2";
import RegFormStep3 from "./rfstep3";
import Stepper from './stepper';

const RegForm = () => {
  const locale = useLocale() ?? getDefLocale();
  
  const t = useTranslations("ui.forms.auth.register");
  const tbtn = useTranslations("ui.buttons");
  
  const [dataToast, setDataToast] = useState({ 
    type: "", 
    message: "", 
    statusToast: false, 
    displayName: "" 
  } as DataToastsProps);
  
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
        const aname = displayName ?? username ?? email;
        setDataToast({type: "success", message: t("apimessages.success", {username: aname}) ?? `You've been registered as ${aname}`, statusToast: true, displayName: aname});
        clearForm();

        setTimeout(() => {
          push('/'+locale);
        }, 500);
      }).catch((err) => {
        console.error(err);
        setDataToast({type: "error", message: t("apimessages.error", {message: ""+err.message}) ?? `Failed to register your new account! Message: ${err.message}`, statusToast: true, displayName: formData.email});
        location.reload();
      });
    } catch (error) {
      console.error(error);
      setDataToast({type: "error", message: t("apimessages.errorapi", {message: ""+error}) ?? `Error when trying to register your new account! Message: ${error}`, statusToast: true, displayName: formData.email});
      location.reload();
    }
  };

  const getDisplayName = () => {
    return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].displayName : null;
  };

  return (
    <>
      {dataToast.statusToast && <Toasts id={"toastRegisterFrm"} data={dataToast} modeType={0} />}
    
      {!!isLoggedIn && (
        <div className="col-12 mx-auto">
          <div className="card">
            <div className="card-body">
              <h3>{t("title") ?? "Register"}</h3>
              <p>{t("lblregistered", {displayName: getDisplayName()}) ?? `You already registered in as ${getDisplayName()}!`}</p>
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
