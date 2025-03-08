/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import styles from "@/app/page.module.scss";

const steps = ["User Data", "Personal Data", "Final steps"];

const Stepper = ({currentStep}: any) => {
  const getStepperAct = (index: number) => {
    return currentStep === index + 1 ? styles.stepperactive + " sactive" : "";
  }

  const getStepperComp = (index: number) => {
    return index + 1 < currentStep ? styles.steppercomplete + " scomplete" : "";
  }

  return (
    <div className="d-flex justify-content-between h-auto align-items-center mt-3 mb-3 p-3">
      {steps.map((step, index) => (
        <div
          className={`${styles.stepper} ${getStepperAct(index)} ${getStepperComp(index)}`}
          id="stepper"
          key={index}
        >
          <div className={styles.stepperind} id="stepperind">{index + 1}</div>
          <p className={styles.steppertext} id="steppertext">{step}</p>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
