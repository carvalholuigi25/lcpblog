/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import styles from "@applocale/page.module.scss";
import { useTranslations } from "next-intl";

const Stepper = ({ currentStep }: any) => {
  const t = useTranslations("ui.forms.auth.register.steppers");

  const getStepperAct = (index: number) => {
    return currentStep === index + 1 ? styles.stepperactive + " sactive" : "";
  }

  const getStepperComp = (index: number) => {
    return index + 1 < currentStep ? styles.steppercomplete + " scomplete" : "";
  }

  const steps = [(t("lblstepper1") ?? "User Data"), (t("lblstepper2") ?? "Personal Data"), (t("lblstepper3") ?? "Final steps")];

  return (
    <div className="d-flex justify-content-between h-auto align-items-center mt-3 mb-3 p-3">
      {steps.map((step, index) => (
        <div key={index} className={styles.msstepper} id="msstepper">
          <div
            className={`${styles.stepper} ${getStepperAct(index)} ${getStepperComp(index)}`}
            id="stepper"
          >
            <div className={styles.stepperind} id="stepperind">{index + 1}</div>
            <p className={styles.steppertext} id="steppertext">{step}</p>
          </div>
          <hr className={styles.stepperline} id="stepperline" />
        </div>
      ))}
    </div>
  );
};

export default Stepper;
