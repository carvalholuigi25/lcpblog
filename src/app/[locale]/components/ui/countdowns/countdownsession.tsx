import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { delFromStorage } from "@applocale/hooks/localstorage";
import LoadingComp from "@applocale/components/ui/loadingcomp";

interface CountdownSessionProps {
  dateSession: string | number | Date;
  onFinish: () => void;
}

export default function CountdownSession({dateSession, onFinish}: CountdownSessionProps) {
  const t = useTranslations('ui.countdowns.session');
  
  const startDate = new Date().getTime();
  const endDate = new Date(dateSession).getTime();
  const [timeLeft, setTimeLeft] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateProgress = () => {
      setLoading(false);

      if(progress == 100 && !loading) {
        setTimeLeft(t("endSession") ?? "This session is now finished!");
        onFinish();
        delFromStorage("loginStatus");
        delFromStorage("logInfo");
        location.reload();
        return false;
      }

      const now = new Date();
      const totalDuration = endDate - startDate;
      const timeElapsed = now.getTime() - startDate;
      const percentage = Math.min((timeElapsed / totalDuration) * 100, 100);
      const remainingTime = Math.max(endDate - now.getTime(), 0);

      if (remainingTime > 0) {
        const years = Math.floor(((remainingTime / (1000 * 60 * 60 * 24)) / 31) / 12);
        const months = Math.floor((remainingTime / (1000 * 60 * 60 * 24)) / 31);
        const weeks = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        const lblyears = years.toString().padStart(2, '0') + " " + (t("labelsDate.years") ?? "years");
        const lblmonths = months.toString().padStart(2, '0') + " " + (t("labelsDate.months") ?? "months");
        const lblweeks = weeks.toString().padStart(2, '0') + " " + (t("labelsDate.weeks") ?? "weeks");
        const lbldays = days.toString().padStart(2, '0') + " " + (t("labelsDate.days") ?? "days");
        const lblhours = hours.toString().padStart(2, '0') + " " + (t("labelsDate.hours") ?? "hours");
        const lblminutes = minutes.toString().padStart(2, '0') + " " + (t("labelsDate.minutes") ?? "minutes");
        const lblseconds = seconds.toString().padStart(2, '0') + " " + (t("labelsDate.seconds") ?? "seconds");

        setProgress(percentage);
        setTimeLeft(`${lblyears} ${lblmonths} ${lblweeks} ${lbldays} ${lblhours} ${lblminutes} ${lblseconds}`);
      } else {
        setProgress(100);
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate, progress, loading, onFinish, t]);

  if (loading) {
    return (
      <LoadingComp type="icon" icontype="ring" />
    );
  }

  return (
    <>
    <p className="text-center">{t('title', {dateEnd: new Date(dateSession).toISOString()}) ?? `Your session expires in: ${new Date(dateSession).toISOString()}`}</p>
    <div className="progress w-100 mt-3" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-bar progress-bar-striped w-100" style={{width: progress + "%"}}>
        {timeLeft}
      </div>
    </div>
    </>
  );
}
