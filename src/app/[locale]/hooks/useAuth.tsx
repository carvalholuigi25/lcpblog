import { useState, useEffect } from "react";
import { UserRole } from "@applocale/interfaces/user";
import { getFromStorage } from "./localstorage";

export const useAuth = () => {
  const [role, setRole] = useState<UserRole>();

  useEffect(() => {
    const userinfo = getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0] : null;
    setRole(userinfo ? userinfo.role : "guest");
  }, []);

  return { role };
};
