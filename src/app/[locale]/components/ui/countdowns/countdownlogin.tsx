import { useState, useEffect } from "react";
import LoadingComp from "@applocale/components/ui/loadingcomp";

interface CountdownLoginProps {
  datecur: string | number | Date;
  onFinish: () => void;
}

export default function CountdownLogin({datecur, onFinish}: CountdownLoginProps) {
  const startDate = new Date().getTime();
  const endDate = new Date(datecur).getTime();
  const [timeLeft, setTimeLeft] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateProgress = () => {
      setLoading(false);

      if(progress == 100 && !loading) {
        setTimeLeft("Finished!");
        onFinish();
        return false;
      }

      const now = new Date();
      const totalDuration = endDate - startDate;
      const timeElapsed = now.getTime() - startDate;
      const percentage = Math.min((timeElapsed / totalDuration) * 100, 100);
      const remainingTime = Math.max(endDate - now.getTime(), 0);

      if (remainingTime > 0) {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);
        setProgress(percentage);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setProgress(100);
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate, progress, loading, onFinish]);

  if (loading) {
    return (
      <LoadingComp type="icon" icontype="ring" />
    );
  }

  return (
    <div className="progress w-100 mt-3" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-bar progress-bar-striped w-100" style={{width: progress + "%"}}>
        {timeLeft}
      </div>
    </div>
  );
}
